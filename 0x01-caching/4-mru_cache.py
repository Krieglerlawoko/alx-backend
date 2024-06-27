#!/usr/bin/env python3
"""
Task 4: MRU Caching.
"""
from collections import OrderedDict

from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """A class MRUCache that inherits
    from BaseCaching and implements a
    Most Recently Used (MRU) caching system.
    """

    def __init__(self):
        """Initialize the MRUCache class."""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Add an item in the cache."""
        if key is None or item is None:
            return
        if key in self.cache_data:
            self.cache_data.move_to_end(key, last=True)
        self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            mru_key, _ = self.cache_data.popitem(last=True)
            print(f"DISCARD: {mru_key}")

    def get(self, key):
        """Retrieve an item by key."""
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=True)
            return self.cache_data[key]
        return None
