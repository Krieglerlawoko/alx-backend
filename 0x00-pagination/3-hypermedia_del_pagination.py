#!/usr/bin/env python3
"""
3-hypermedia
"""

import csv
import math
from typing import List, Dict, Optional


def index_range(page: int, page_size: int) -> tuple:
    """Return a tuple of size two containing a start index and an end index."""
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names."""

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset"""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]
        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0"""
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            self.__indexed_dataset = {
                i: dataset[i]
                for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Return a dictionary with deletion-resilient pagination metadata.

        Args:
            index (int): index of the first item
            in the current page (default: None)
            page_size (int): number of items per page (default: 10)

        Returns:
            Dict: Dictionary containing pagination metadata
        """
        assert isinstance(index, int) and index >= 0
        assert index < len(indexed_data)
        data = []
        next_index = index
        while len(data) < page_size and next_index < len(indexed_data):
            if next_index in indexed_data:
                data.append(indexed_data[next_index])
            next_index += 1
        return {
            "index": index,
            "next_index": next_index,
            "page_size": len(data),
            "data": data
        }
