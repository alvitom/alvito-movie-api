class ApiResponse {
  static success(res, data, message = "Operation completed successfully", statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  }

  static error(res, message = "Something went wrong", errors = {}, statusCode = 500) {
    return res.status(statusCode).json({
      status: "error",
      message,
      errors,
    });
  }

  static pagination(res, data, paginationInfo, message = "Data fetched successfully", statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
      first_page_url: paginationInfo.first_page_url,
      last_page_url: paginationInfo.last_page_url,
      prev_page_url: paginationInfo.prev_page_url,
      next_page_url: paginationInfo.next_page_url,
      current_page: paginationInfo.current_page,
      last_page: paginationInfo.last_page,
      from: paginationInfo.from,
      to: paginationInfo.to,
      total: paginationInfo.total,
      path: paginationInfo.path,
      per_page: paginationInfo.per_page,
    });
  }

  static show(res, data, info, message = "Data fetched successfully", statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
      credits: info.credits,
      videos: info.videos,
      images: info.images,
    });
  }
}

module.exports = ApiResponse;
