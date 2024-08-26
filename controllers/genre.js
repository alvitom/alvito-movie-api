const axiosInstance = require("../utils/axiosInstance");
const httpResponse = require("../utils/httpResponse");

const movie = async (_, res, next) => {
  try {
    const response = await axiosInstance.get("/genre/movie/list");

    if (!response.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "Genre Not Found" }, 404);
    }

    const data = {
      results: response.data.genres,
      total_results: response.data.genres.length,
    };

    httpResponse(res, "Genre Movie List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

const tv = async (_, res, next) => {
  try {
    const response = await axiosInstance.get("/genre/tv/list");

    if (!response.data) {
      return httpResponse(res, "Request failed with status code 404", { error: "Genre Not Found" }, 404);
    }

    const data = {
      results: response.data.genres,
      total_results: response.data.genres.length,
    };

    httpResponse(res, "Genre TV List Retrieved Successfully", data, 200);
  } catch (error) {
    if (error.name === "AxiosError") {
      return httpResponse(res, `Request failed with status code ${error.response.status}`, { error: error.response.data.status_message }, error.response.status);
    }
    next(error);
  }
};

module.exports = { movie, tv };
