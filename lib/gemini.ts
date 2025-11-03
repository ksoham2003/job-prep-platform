// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export class ResumeAnalyzer {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
  }

  async analyzeResume(resumeText: string, jobDescription: string, jobTitle: string): Promise<any> {
    const prompt = `
      You are an expert resume reviewer and career coach. Analyze the following resume for the job position.

      JOB TITLE: ${jobTitle}
      
      RESUME:
      ${resumeText.substring(0, 15000)}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Please provide a comprehensive analysis in JSON format with the following structure:
      {
        "strengths": [""],
        "weaknesses": [""],
        "suggestions": [""],
        "score": 0,
        "matchedSkills": [""],
        "missingSkills": [""],
        "analysis": ""
      }
      
      Guidelines:
      - Strengths: 3-5 key strengths that align with the job
      - Weaknesses: 3-5 areas that need improvement
      - Suggestions: 5-7 actionable, specific suggestions
      - Score: 0-100 based on overall match with job requirements
      - Matched Skills: Skills from resume that match job requirements
      - Missing Skills: Important skills from job description missing in resume
      - Analysis: 3-4 paragraph detailed analysis with specific recommendations
      
      Focus on:
      1. Skills alignment with job requirements
      2. Experience relevance and impact quantification
      3. Keyword optimization for ATS systems
      4. Formatting, structure, and clarity
      5. Achievement quantification with numbers
      6. Missing technologies or qualifications
      
      Be constructive, specific, and actionable. Provide concrete examples of how to improve.
      
      Return only valid JSON without any markdown formatting or code blocks.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse the response
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const analysisData = JSON.parse(cleanedText);

      // Validate and ensure all fields are present
      return {
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.weaknesses || [],
        suggestions: analysisData.suggestions || [],
        score: Math.min(100, Math.max(0, analysisData.score || 50)),
        matchedSkills: analysisData.matchedSkills || [],
        missingSkills: analysisData.missingSkills || [],
        analysis: analysisData.analysis || 'Analysis completed successfully.',
      };

    } catch (error) {
      console.error('Error in Gemini analysis:', error);
      throw new Error('Failed to analyze resume with AI');
    }
  }

  async generateInterviewQuestions(resumeText: string, jobDescription: string, type: 'technical' | 'behavioral'): Promise<string[]> {
    const prompt = `
      Generate 5 ${type} interview questions based on:
      - Resume: ${resumeText.substring(0, 5000)}
      - Job Description: ${jobDescription}
      
      Return as JSON array of strings.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error generating interview questions:', error);
      return [];
    }
  }
}