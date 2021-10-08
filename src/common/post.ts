/**
 * @link https://help.docbase.io/posts/92984#%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E4%BE%8B
 */
export interface DocBasePost {
  id: number;
  title: string;
  body: string;
  draft: false;
  archived: false;
  url: string;
  created_at: string;
  updated_at: string;
  scope: string;
  sharing_url: string;
  tags: DocBaseTag[];
  user: DocBaseUser;
  stars_count: number;
  good_jobs_count: number;
  comments: DocBaseComment[];
  groups: [];
}

interface DocBaseUser {
  id: number;
  name: string;
  profile_image_url: string;
}

interface DocBaseTag {
  name: string;
}

interface DocBaseComment {
  id: number;
  body: string;
  created_at: string;
  user: DocBaseUser;
}
