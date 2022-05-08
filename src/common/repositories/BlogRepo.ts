import BlogModel from '../models/BlogModel';
import { BlogCreation } from '../types/common';

class BlogRepository {
  createBlog(datas: BlogCreation) {
    return BlogModel.create(datas);
  }

  getAllBlogs(page: number, limit: number) {
    const offset = limit * (page - 1);
    return BlogModel.findAll({
      limit: limit,
      offset: offset,
    });
  }

  getBlogByName = (title: string) => {
    return BlogModel.findOne({
      where: {
        title: title,
      },
    });
  };
}

export default new BlogRepository();
