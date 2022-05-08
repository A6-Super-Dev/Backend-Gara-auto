import BlogModel from '../models/BlogModel';
import { BlogCreation } from '../types/common';

class BlogRepository {
  async createBlog(datas: BlogCreation) {
    return await BlogModel.create(datas);
  }

  async getAllBlogs(page: number, limit: number) {
    const offset = limit * (page - 1);
    return await BlogModel.findAll({
      limit: limit,
      offset: offset,
    });
  }
  getBlogByName = async (title: string) => {
    return await BlogModel.findOne({
      where: {
        title: title,
      },
    });
  };
}

export default new BlogRepository();
