#!/usr/bin/env python3
""" LRUCache module """

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """ LRUCache class that inherits from BaseCaching """

    def __init__(self):
        """ Initialize the class """
        super().__init__()
        self.usage_order = []

    def put(self, key, item):
        """ Add an item in the cache """
        if key is not None and item is not None:
            if key in self.cache_data:
                self.usage_order.remove(key)
            self.cache_data[key] = item
            self.usage_order.append(key)
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                lru_key = self.usage_order.pop(0)
                del self.cache_data[lru_key]
                print(f"DISCARD: {lru_key}")

    def get(self, key):
        """ Get an item by key """
        if key in self.cache_data:
            self.usage_order.remove(key)
            self.usage_order.append(key)
            return self.cache_data[key]
        return None
