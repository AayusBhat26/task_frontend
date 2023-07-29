import axiosClient from "./axiosClient";

const taskApi = {
  // find: (boardId, taskId) =>
    // axiosClient.get('/task'),
  create: (boardId, params) =>
    axiosClient.post(`boards/${boardId}/tasks`, params),
  updatePosition: (boardId, params) =>
    axiosClient.put(`boards/${boardId}/tasks/update-position`, params),
  delete: (boardId, taskId) =>
    axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),
  update: (boardId, taskId, params) =>
    axiosClient.put(`boards/${boardId}/tasks/${taskId}`, params),
};

export default taskApi;
