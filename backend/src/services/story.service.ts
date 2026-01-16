import prisma from '../utils/prisma';
import { Prisma, Category, Status } from '../../generated/prisma';

interface CreateStoryData {
  title: string;
  author: string;
  synopsis: string;
  category: Category;
  coverUrl?: string;
  tags: string[];
  status: Status;
  chapters?: { title: string; content: string }[]; 
}

interface UpdateStoryData {
  title?: string;
  author?: string;
  synopsis?: string;
  category?: Category;
  coverUrl?: string;
  tags?: string[];
  status?: Status;
}

interface StoryFilters {
  search?: string;
  category?: Category;
  status?: Status;
  page?: number;
  limit?: number;
}

class StoryService {
  async createStory(data: CreateStoryData) {
    const { chapters, ...storyData } = data;

    return await prisma.story.create({
      data: {
        ...storyData,
        chapters: {
          create: chapters || [],
        },
      },
      include: {
        chapters: true,
      },
    });
  }

  async getAllStories(filters: StoryFilters = {}) {
    const { search, category, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.StoryWhereInput = {};

    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      whereCondition.category = category;
    }

    if (status) {
      whereCondition.status = status;
    }

    try {
      const [stories, total] = await prisma.$transaction([
        prisma.story.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: { updatedAt: 'desc' },
          include: {
            _count: { select: { chapters: true } }, 
          },
        }),
        prisma.story.count({ where: whereCondition }),
      ]);

      return {
        stories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('Prisma error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  async getStoryById(id: string) {
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { createdAt: 'asc' }, 
        },
      },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    return story;
  }

  async updateStory(id: string, data: UpdateStoryData) {
    await this.getStoryById(id);

    return await prisma.story.update({
      where: { id },
      data,
      include: {
        chapters: true,
      },
    });
  }

  async deleteStory(id: string) {
    await this.getStoryById(id);

    return await prisma.story.delete({
      where: { id },
    });
  }

  async getDashboardStats() {
    const [totalStories, publishedStories, draftStories, totalChapters] = await prisma.$transaction([
      prisma.story.count(),
      prisma.story.count({ where: { status: 'PUBLISH' } }),
      prisma.story.count({ where: { status: 'DRAFT' } }),
      prisma.chapter.count(),
    ]);

    return {
      total: totalStories,
      published: publishedStories,
      draft: draftStories,
      totalChapters,
    };
  }
}

export default new StoryService();