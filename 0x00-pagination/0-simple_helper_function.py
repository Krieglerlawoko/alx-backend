#!/usr/bin/env python3i
"""index range function"""


def index_range(page: int, page_size: int) -> tuple:
    """
    Return a tuple of size two containing
    a start index and an end index
    corresponding to the range of
    indexes to return in a list for those
    particular pagination parameters.
    Args:
        page (int): page number (1-indexed)
        page_size (int): number of items per page
    Returns:
        tuple: (start index, end index)
    """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return (start_index, end_index)
