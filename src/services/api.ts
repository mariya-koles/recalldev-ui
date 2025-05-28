import axios, { AxiosInstance } from 'axios';
import {
  Question,
  Tag,
  CreateQuestionRequest,
  CreateTagRequest,
  UpdateQuestionRequest,
  DifficultyLevel,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Questions API
  async getQuestions(includeTags: boolean = false): Promise<Question[]> {
    const response = await this.api.get('/questions', {
      params: { includeTags },
    });
    return response.data;
  }

  async getQuestion(id: number, includeTags: boolean = false): Promise<Question> {
    const response = await this.api.get(`/questions/${id}`, {
      params: { includeTags },
    });
    return response.data;
  }

  async createQuestion(question: CreateQuestionRequest): Promise<Question> {
    const response = await this.api.post('/questions', question);
    return response.data;
  }

  async updateQuestion(id: number, question: UpdateQuestionRequest): Promise<Question> {
    const response = await this.api.put(`/questions/${id}`, question);
    return response.data;
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.api.delete(`/questions/${id}`);
  }

  async getQuestionsByDifficulty(difficulty: DifficultyLevel): Promise<Question[]> {
    const response = await this.api.get(`/questions/difficulty/${difficulty}`);
    return response.data;
  }

  async searchQuestions(keyword: string): Promise<Question[]> {
    const response = await this.api.get('/questions/search', {
      params: { keyword },
    });
    return response.data;
  }

  async getQuestionsByTag(tagName: string): Promise<Question[]> {
    const response = await this.api.get(`/questions/tag/${tagName}`);
    return response.data;
  }

  async getQuestionsByTags(tagNames: string[]): Promise<Question[]> {
    const response = await this.api.get('/questions/tags', {
      params: { tagNames: tagNames.join(',') },
    });
    return response.data;
  }

  async addTagToQuestion(questionId: number, tagName: string): Promise<void> {
    await this.api.post(`/questions/${questionId}/tags/${tagName}`);
  }

  async removeTagFromQuestion(questionId: number, tagName: string): Promise<void> {
    await this.api.delete(`/questions/${questionId}/tags/${tagName}`);
  }

  async setQuestionTags(questionId: number, tagNames: string[]): Promise<void> {
    await this.api.put(`/questions/${questionId}/tags`, tagNames);
  }

  // Tags API
  async getTags(includeQuestions: boolean = false): Promise<Tag[]> {
    // Try different parameter names the backend might expect
    const params: any = {};
    if (includeQuestions) {
      params.includeQuestions = true;
      params.withQuestions = true; // Alternative parameter name
    }
    
    const response = await this.api.get('/tags', { params });
    return response.data;
  }

  async getTag(id: number): Promise<Tag> {
    const response = await this.api.get(`/tags/${id}`);
    return response.data;
  }

  async getTagByName(name: string): Promise<Tag> {
    const response = await this.api.get(`/tags/name/${name}`);
    return response.data;
  }

  async createTag(tag: CreateTagRequest): Promise<Tag> {
    const response = await this.api.post('/tags', tag);
    return response.data;
  }

  async updateTag(id: number, tag: CreateTagRequest): Promise<Tag> {
    const response = await this.api.put(`/tags/${id}`, tag);
    return response.data;
  }

  async deleteTag(id: number): Promise<void> {
    await this.api.delete(`/tags/${id}`);
  }

  async searchTags(keyword: string): Promise<Tag[]> {
    const response = await this.api.get('/tags/search', {
      params: { keyword },
    });
    return response.data;
  }

  async getTagsWithQuestions(): Promise<Tag[]> {
    const response = await this.api.get('/tags/with-questions');
    return response.data;
  }

  async getTagsWithoutQuestions(): Promise<Tag[]> {
    const response = await this.api.get('/tags/without-questions');
    return response.data;
  }

  // Helper method to get question count for each tag
  async getTagsWithQuestionCounts(): Promise<Tag[]> {
    try {
      // Get all tags first
      const tags = await this.getTags(false);
      
      // For each tag, get the questions that have this tag
      const tagsWithCounts = await Promise.all(
        tags.map(async (tag) => {
          try {
            const questions = await this.getQuestionsByTag(tag.name);
            return {
              ...tag,
              questions: questions
            };
          } catch (error) {
            console.warn(`Failed to get questions for tag ${tag.name}:`, error);
            return {
              ...tag,
              questions: []
            };
          }
        })
      );
      
      return tagsWithCounts;
    } catch (error) {
      console.error('Error getting tags with question counts:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService; 