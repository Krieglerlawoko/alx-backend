#!/usr/bin/env python3
""" LFUCache module """

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LFUCache class that inherits from BaseCaching """

    def __init__(self):
        """ Initialize the class """
        super().__init__()
        self.usage_freq = {}
        self.usage_order = []

    def put(self, key, item):
        """ Add an item in the cache """
        if key is not None and item is not None:
            if key in self.cache_data:
                self.usage_freq[key] += 1
            else:
                self.usage_freq[key] = 1
            self.cache_data[key] = item
            if key in self.usage_order:
                self.usage_order.remove(key)
            self.usage_order.append(key)
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                lfu_key = min(
                    self.usage_freq,
                    key=lambda k: (
                        self.usage_freq[k],
                        self.usage_order.index(k)))
                del self.cache_data[lfu_key]
                del self.usage_freq[lfu_key]
                self.usage_order.remove(lfu_key)
                print(f"DISCARD: {lfu_key}")

    def get(self, key):
        """ Get an item by key """
        if key in self.cache_data:
            self.usage_freq[key] += 1
            self.usage_order.remove(key)
            self.usage_order.append(key)
            return self.cache_data[key]
        return None
