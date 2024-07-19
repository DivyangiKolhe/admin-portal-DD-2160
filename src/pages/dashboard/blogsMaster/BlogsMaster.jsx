import React from 'react';
import BlogsReuseable from '../../../components/BlogsMaster/BlogsReuseable';

const BlogsMaster = () => {
  return (
    <div className='flex flex-col gap-4 p-8'>
        <BlogsReuseable blogFor="users" />
        <BlogsReuseable blogFor="doctors" />
        <BlogsReuseable blogFor="meditation-routines" />
    </div>
  )
}

export default BlogsMaster