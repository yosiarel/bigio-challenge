import request from 'supertest';
import { createApp } from '../app';
import { mockPrisma } from './setup';

const app = createApp();

describe('Chapter API', () => {
  describe('POST /api/stories/:storyId/chapters', () => {
    it('should create a new chapter', async () => {
      const mockStory = {
        id: '1',
        title: 'Test Story',
        author: 'Test Author',
        synopsis: 'Synopsis',
        category: 'FINANCIAL',
        coverUrl: null,
        tags: [],
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockChapter = {
        id: '1',
        title: 'Chapter 1',
        content: 'Chapter content',
        storyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.story.findUnique.mockResolvedValue(mockStory as any);
      mockPrisma.chapter.create.mockResolvedValue(mockChapter as any);

      const response = await request(app)
        .post('/api/stories/1/chapters')
        .send({
          title: 'Chapter 1',
          content: 'Chapter content',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Chapter 1');
    });

    it('should return 404 for non-existent story', async () => {
      mockPrisma.story.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/stories/999/chapters')
        .send({
          title: 'Chapter 1',
          content: 'Content',
        });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid chapter data', async () => {
      const response = await request(app)
        .post('/api/stories/1/chapters')
        .send({
          title: '',
          content: '',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/stories/:storyId/chapters/:chapterId', () => {
    it('should get chapter by id', async () => {
      const mockChapter = {
        id: '1',
        title: 'Chapter 1',
        content: 'Chapter content',
        storyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        story: {
          id: '1',
          title: 'Test Story',
        },
      };

      mockPrisma.chapter.findUnique.mockResolvedValue(mockChapter as any);

      const response = await request(app).get('/api/stories/1/chapters/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Chapter 1');
    });

    it('should return 404 for non-existent chapter', async () => {
      mockPrisma.chapter.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/stories/1/chapters/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/stories/:storyId/chapters/:chapterId', () => {
    it('should update chapter via story route', async () => {
      const mockChapter = {
        id: '1',
        title: 'Updated Chapter',
        content: 'Updated content',
        storyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.chapter.findUnique.mockResolvedValue(mockChapter as any);
      mockPrisma.chapter.update.mockResolvedValue(mockChapter as any);

      const response = await request(app)
        .put('/api/stories/1/chapters/1')
        .send({
          title: 'Updated Chapter',
          content: 'Updated content',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Chapter');
    });
  });

  describe('PUT /api/chapters/:id', () => {
    it('should update a chapter', async () => {
      const mockChapter = {
        id: '1',
        title: 'Updated Chapter',
        content: 'Updated content',
        storyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.chapter.findUnique.mockResolvedValue(mockChapter as any);
      mockPrisma.chapter.update.mockResolvedValue(mockChapter as any);

      const response = await request(app)
        .put('/api/chapters/1')
        .send({
          title: 'Updated Chapter',
          content: 'Updated content',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Chapter');
    });

    it('should return 404 when updating non-existent chapter', async () => {
      mockPrisma.chapter.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/chapters/999')
        .send({
          title: 'Updated',
          content: 'Content',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/chapters/:id', () => {
    it('should delete a chapter', async () => {
      const mockChapter = {
        id: '1',
        title: 'Chapter 1',
        content: 'Content',
        storyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.chapter.findUnique.mockResolvedValue(mockChapter as any);
      mockPrisma.chapter.delete.mockResolvedValue(mockChapter as any);

      const response = await request(app).delete('/api/chapters/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPrisma.chapter.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return 404 when deleting non-existent chapter', async () => {
      mockPrisma.chapter.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/chapters/999');

      expect(response.status).toBe(404);
    });
  });

  describe('Cascade Delete', () => {
    it('should delete all chapters when story is deleted', async () => {
      const mockStory = {
        id: '1',
        title: 'Test Story',
        author: 'Author',
        synopsis: 'Synopsis',
        category: 'FINANCIAL',
        coverUrl: null,
        tags: [],
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.story.findUnique.mockResolvedValue(mockStory as any);
      mockPrisma.story.delete.mockResolvedValue(mockStory as any);

      const response = await request(app).delete('/api/stories/1');

      expect(response.status).toBe(200);
      expect(mockPrisma.story.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
