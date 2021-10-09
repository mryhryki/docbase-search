import fetch from "node-fetch";
import { getDocBaseAccessToken, getDocBaseDomain } from "../common/env";
import { DocBasePost } from "../common/post";

const SuccessStatus = [200, 201, 204];

// https://help.docbase.io/posts/45703
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchDocBaseApi = async (method: string, path: string): Promise<any> => {
  const res = await fetch(`https://api.docbase.io${path}`, {
    method,
    headers: {
      "X-DocBaseToken": getDocBaseAccessToken(),
      "X-Api-Version": "2",
    },
  });

  if (!SuccessStatus.includes(res.status)) {
    const errorMessage = await res.text();
    console.error(`ERROR: ${errorMessage}`);
    throw new Error(`DocBase API respond error status code: ${res.status}`);
  }
  return await res.json();
};

interface FetchPostsResponse {
  posts: DocBasePost[];
  hasNext: boolean;
}

// https://help.docbase.io/posts/92984
export const fetchPosts = async (page: number, startDate: string, endDate: string): Promise<FetchPostsResponse> => {
  const q = `asc:created_at created_at:${startDate}~${endDate}`;
  const query = `q=${encodeURIComponent(q)}&page=${page}&per_page=100`;
  const res = await fetchDocBaseApi("GET", `/teams/${getDocBaseDomain()}/posts?${query}`);
  return {
    posts: res.posts,
    hasNext: res.meta.next_page != null,
  };
};
