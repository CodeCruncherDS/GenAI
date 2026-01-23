from dataclasses import dataclass
from typing import List, Callable

@dataclass(frozen=True)
class Step:
    name: str
    fn: Callable[[str], str]

class PromptChain:
    def __init__(self, steps: List[Step]):
        self.steps = steps

    def run(self, input_text: str) -> str:
        x = input_text
        for step in self.steps:
            x = step.fn(x)
        return x
