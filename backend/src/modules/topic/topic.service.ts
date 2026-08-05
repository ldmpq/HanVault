import { db } from '../../config/database';
import { topics, vocabularyTopics } from '../../shared/schema';
import { sql } from 'drizzle-orm';

export class TopicService {
  /**
   * Lấy danh sách toàn bộ chủ đề kèm số lượng từ vựng có trong mỗi chủ đề
   */
  static async getAllTopics() {
    const allTopics = await db
      .select({
        id: topics.id,
        name: topics.name,
        slug: topics.slug,
        // Đếm số lượng từ vựng trong chủ đề thông qua bảng trung gian
        vocabCount: sql<number>`(SELECT count(*) FROM ${vocabularyTopics} WHERE ${vocabularyTopics.topicId} = ${topics.id})`.mapWith(Number)
      })
      .from(topics)
      .orderBy(topics.id);

    return allTopics;
  }
}