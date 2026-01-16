import prisma from '../utils/prisma';

interface CreateChapterData {
  title: string;
  content: string;
  storyId: string;
}

interface UpdateChapterData {
  title?: string;
  content?: string;
}

class ChapterService {
  async getChapterById(id: string) {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        story: true,
      },
    });

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    return chapter;
  }

  async createChapter(data: CreateChapterData) {
    const story = await prisma.story.findUnique({
      where: { id: data.storyId },
    });

    if (!story) {
      throw new Error('Story not found');
    }

    return await prisma.chapter.create({
      data,
      include: {
        story: true,
      },
    });
  }

  async updateChapter(id: string, data: UpdateChapterData) {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    return await prisma.chapter.update({
      where: { id },
      data,
      include: {
        story: true,
      },
    });
  }

  async deleteChapter(id: string) {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    return await prisma.chapter.delete({
      where: { id },
    });
  }
}

export default new ChapterService();
