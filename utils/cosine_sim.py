import re
import math
from collections import Counter


class CosineSimilarity(object):
    def __init__(self, strip=True, normalize=True):
        self.word_pattern = re.compile("\w+")
        self.sanitize_pattern = re.compile(r"[-!$%^&*()_+|~=`{}\[\]:\";'<>?,.\/]")
        self.strip_punctuation = strip
        self.normalize = normalize

    def sanitize(self, string):
        return self.sanitize_pattern.sub("", string)

    def vectorize(self, string):
        if self.normalize:
            string = string.lower()
        if self.strip_punctuation:
            string = self.sanitize(string)
        words = self.word_pattern.findall(string)
        return Counter(words)

    def calculate(self, vec1, vec2):
        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum([vec1[x] * vec2[x] for x in intersection])

        sum1 = sum([vec1[x]**2 for x in vec1.keys()])
        sum2 = sum([vec2[x]**2 for x in vec2.keys()])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)

        if not denominator:
            return 0.0
        else:
            return float(numerator) / denominator
