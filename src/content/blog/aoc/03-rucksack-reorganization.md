---
description: '🎄👨‍💻 Day 3: Rucksack Reorganization'
tags:
  - aoc
title: '🎄👨‍💻 Day 3: Rucksack Reorganization'
written: 2022-12-03 20:35:50 +0000
slug: aoc22-03
---

It's a classic problem of those who are not used to hiking: preparing a backpack and carrying only what is necessary, no extra unneeded stuff.

The Elves made a big mess with the backpacks. Each backpack has two equal compartments, and there is a finite list of items that they can bring with them. Our input is the list of contents of the backpacks. Each line is a string in which each character represents an item class. Some people put more stuff and some put less, but the two compartments contain the same number of items. The problem is that the person who made the backpacks put some items of the same type in **both** compartments. That's unnecessary weight.

### Part 1

Not all elements have equal priority, and we have to calculate the total priority of those elements that are present **in both compartments**. We know that there is only one class of items.

The priorities are calculated simply according to alphabetical order. Elements labeled `a-z` have priorities 1-26, while those `A-Z` will have 27-52. We can construct a dictionary on the fly that contains each element with its priority:

```python
# a-z and A-Z letters
from string import ascii_lowercase, ascii_uppercase

prios = {letter: prio for prio, letter in \
         enumerate(ascii_lowercase + ascii_uppercase, start=1)}
```

The gist of the problem is an intersection operation between the two compartments of each backpack. And again, everything is already built-in into Python thanks to sets[^1]. Thus:

1. We divide the string of each row in two and construct two sets.
2. We do the intersection and then retrieve the priority of the common element.

Part one's solution is the sum of all priorities:

```python
def part1(data):
    """Solve part 1"""
    total = 0
    for line in data:
        mid = len(line) / 2
        first, second = set(line[:mid]), set(line[mid:])
        total += prio[(first & second).pop()]
    return total
```

Using `.pop()` seems to be naive as the resulting set will have only one element, but a standard `set` doesn't support indexing[^2].

[^1]: Need a review? A set is a collection of **unique** elements where the order is **irrelevant**.
[^2]: It doesn't make too much sense without ordering, right?

### Part 2

We know that the Elves will take part in the expedition in groups of three. Each group splits the load into the three backpacks, but there is one item that each Elf must always have: their badge. Each trio will have a badge indicated with a different letter, but we do not know which letter each group's badge corresponds to.

Since each Elf has only one badge, we need to find which item's class is present in all their backpacks. Instead of the compartments of a single backpack, we must consider the **entire contents of the three backpacks** in the group:

```python
def part2(data):
    """Solve part 2"""
    total = 0
    i = 0
    for line in data[::3]: # we jump by 3 lines
        group = set(line) & set(data[i+1]) & set(data[i+2])
        total += prio[group.pop()] # same thing as in Part 1
        i += 3 # don't forget to increase the counter!
    return total
```

I suspect that the `for` loop with the manual counter isn't the best way to implement that logic, but I didn't come up with a better solution (for the moment).
