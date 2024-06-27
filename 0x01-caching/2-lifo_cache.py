#!/usr/bin/env python3
""" LIFOCache module """

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ LIFOCache class that inherits from BaseCaching """

    def __init__(self):
        """ Initialize the class """
        super().__init__()
        self.last = None

    def put(self, key, item):
        """ Add an item in the cache """
        if key is not None and item is not None:
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                if self.last is not None:
                    del self.cache_data[self.last]
                    print(f"DISCARD: {self.last}")
            self.last = key

    def get(self, key):
        """ Get an item by key """
        return self.cache_data.get(key, None)
