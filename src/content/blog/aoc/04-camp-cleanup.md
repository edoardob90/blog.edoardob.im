---
description: '🎄👨‍💻 Day 4: Camp Cleanup'
tags:
  - aoc22
title: '🎄👨‍💻 Day 4: Camp Cleanup'
written: 2022-12-04 15:35:07 +0000
slug: aoc22-04
---

Today the Elves start working for real: they need to clear the base camp to make enough space to unload the rest of the material for the upcoming expedition.

“Let's divide the whole area to clear,” an Elf suggests.

“Good idea, let me take care of it,” another one replies.

So the enthusiastic Elf divides the sections and assigns them to the other Elves who will work in pairs. Each pair will work on two ranges of sections, for example `2,4-6,8`: the first Elf will handle sections 2 to 4, the second from 6 to 8.

Unfortunately, the enthusiastic Elf made a bit of a mess. He didn't realize he assigned overlapping ranges. So we have to find out how many sections are already contained in others, so that we can reassign them and avoid unnecessary work for the Elves.

### Part 1

As on Day 3, the anatomy of the problem suggests using sets. We need to determine if a group of numbers is a subset of another or which numbers two groups have in common. Both of these operations are immediate with a `set`.

Perhaps the most interesting part of today’s puzzle is how to parse the input. We have:

```
2-4,6-8
2-3,4-5
5-7,7-9
...
```

and we want

```
[
 [[2,4], [6,8]],
 [[2,3], [4,5]],
 [[5,7], [7,9]],
 ...
]
```

We can do the first step of input parsing in one line (because it's fun):

```python
data = [
 list(map(lambda p: list(map(int, p.split("-"))), pair.split(",")))
 for pair in puzzle_input.splitlines()
]
```

1. We split each line at `,`
2. Each of the elements of this list is split again at `-`, and then each element is converted to integer with `map` and the `lambda` function.

The second step of the parsing phase is to build a “list of pairs of sets”, where each element of the pair includes all the IDs in the range. Here we need to consider one important detail: the ranges **must include** the last ID. Hence, we must increment by 1 the second element of each range, otherwise Python will ignore it. That’s a `for` loop and another `map`:

```python
sets = []
for p1, p2 in data:
	# range must be inclusive
	p1[1] += 1
	p2[1] += 1
	p1, p2 = map(lambda x: set(range(*x)), (p1, p2))
	sets.append((p1, p2))
```

Once we did that, the solution to Part 1 is almost immediate: we only need to find if, in each pair, any set is a subset of the other, and count how many of these overlapping sets there are:

```python
def part1(data):
    overlaps = 0
    for p1, p2 in data:
        if p1 <= p2 or p1 >= p2:
            overlaps += 1
    return overlaps
```

### Part 2

The second part of the problem asks us to find (and count) those pairs of ID ranges that overlap **for at least one ID**. The total will necessarily be greater than the number found in Part 1. The way we read the input allows us to find the solution by changing only one line from Part 1:

```python
def part2(data):
    overlaps = 0
    for p1, p2 in data:
        if p1 & p2:
            overlaps += 1
    return overlaps
```
