import request from 'supertest';
import { createApp } from '../app';
import { mockPrisma } from './setup';
import { Category, Status } from '../../generated/prisma';

const app = createApp();

describe('Story API', () => {
  describe('POST /api/stories', () => {
    it('should create a new story', async () => {
      const mockStory = {
        id: '1',
        title: 'Test Story',
        author: 'Test Author',
        synopsis: 'Test synopsis',
        category: Category.FINANCIAL,
        coverUrl: null,
        tags: ['test'],
        status: Status.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.story.create.mockResolvedValue(mockStory as any);

      const response = await request(app)
        .post('/api/stories')
        .send({
          title: 'Test Story',
          author: 'Test Author',
          synopsis: 'Test synopsis',
          category: 'FINANCIAL',
          tags: ['test'],
          status: 'DRAFT',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Story');
      expect(mockPrisma.story.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/stories')
        .send({
          title: '',
          author: '',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/stories', () => {
    it('should get all stories with pagination', async () => {
      const mockStories = [
        {
          id: '1',
          title: 'Story 1',
          author: 'Author 1',
          synopsis: 'Synopsis 1',
          category: Category.FINANCIAL,
          coverUrl: null,
          tags: ['tag1'],
          status: Status.PUBLISH,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { chapters: 0 },
        },
      ];

      mockPrisma.$transaction.mockResolvedValue([mockStories, 1] as any);

      const response = await request(app).get('/api/stories?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
    });

    it('should filter stories by category', async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0] as any);

      const response = await request(app).get('/api/stories?category=FINANCIAL');

      expect(response.status).toBe(200);
    });

    it('should filter stories by status', async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0] as any);

      const response = await request(app).get('/api/stories?status=PUBLISH');

      expect(response.status).toBe(200);
    });

    it('should search stories by title or author', async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0] as any);

      const response = await request(app).get('/api/stories?search=test');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/stories/:id', () => {
    it('should get a story by id', async () => {
      const mockStory = {
        id: '1',
        title: 'Test Story',
        author: 'Test Author',
        synopsis: 'Test synopsis',
        category: Category.FINANCIAL,
        coverUrl: null,
        tags: ['test'],
        status: Status.DRAFT,
        chapters: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.story.findUnique.mockResolvedValue(mockStory as any);

      const response = await request(app).get('/api/stories/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('1');
    });

    it('should return 404 for non-existent story', async () => {
      mockPrisma.story.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/stories/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/stories/:id', () => {
    it('should update a story', async () => {
      const mockStory = {
        id: '1',
        title: 'Updated Story',
        author: 'Test Author',
        synopsis: 'Test synopsis',
        category: Category.FINANCIAL,
        coverUrl: null,
        tags: ['test'],
        status: Status.PUBLISH,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.story.findUnique.mockResolvedValue(mockStory as any);
      mockPrisma.story.update.mockResolvedValue(mockStory as any);

      const response = await request(app)
        .put('/api/stories/1')
        .send({
          title: 'Updated Story',
          status: 'PUBLISH',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Story');
    });

    it('should return 404 when updating non-existent story', async () => {
      mockPrisma.story.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/stories/999')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/stories/:id', () => {
    it('should delete a story', async () => {
      const mockStory = {
        id: '1',
        title: 'Test Story',
        author: 'Test Author',
        synopsis: 'Test synopsis',
        category: Category.FINANCIAL,
        coverUrl: null,
        tags: ['test'],
        status: Status.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.story.findUnique.mockResolvedValue(mockStory as any);
      mockPrisma.story.delete.mockResolvedValue(mockStory as any);

      const response = await request(app).delete('/api/stories/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPrisma.story.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return 404 when deleting non-existent story', async () => {
      mockPrisma.story.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/stories/999');

      expect(response.status).toBe(404);
    });
  });
});
