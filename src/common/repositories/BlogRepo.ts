import BlogModel from '../models/BlogModel';
import { BlogCreation } from '../types/common';

class BlogRepository {
  async createBlog(datas: BlogCreation) {
    return await BlogModel.create(datas);
  }

  async getAllBlogs() {
    return await BlogModel.findAll({});
  }
}

export default new BlogRepository();
