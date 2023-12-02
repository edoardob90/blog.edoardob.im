---
description: '🎄👨‍💻 Day 1: Calorie Counting'
tags:
  - aoc22
title: '🎄👨‍💻 Day 1: Calorie Counting'
written: 2022-12-01 22:19:25 +0000
slug: aoc22-01
---

The first day - maybe the first week - is just warming up. It serves to get us back into the mood, a Christmas-flavored atmosphere that is anything but passive: it is not the awaiting of something or someone that is supposed to come, but a road that will get steeper day by day to make us sweat out the 25 stars before Christmas.

In this year's adventure, the Elves are on an expedition to a mysterious island to retrieve Santa's reindeers favorite food, food that contains the indispensable “magic energy”. There will be a jungle to traverse, so let's get ready for some obstacle running or mazes among the trees.

### Part 1

The Elves sort the food they brought with them and want to make sure they have enough. We need to count how much food each Elf brings. The puzzle input divides each Elf’s rations into blocks separated by blank lines. So here’s how to read the input: divide it at the blank lines and convert everything to integers.

```python
lines = [
    list(map(int, line.strip().split("\n")))
    for line in re.split(r"^$", puzzle_input, flags=re.M)
]
```

We’ll end up with a list of lists. To find the solution, it suffices to sum up each sub-list, and then find the largest sum of all.

A quick explanatory note: we used the `re.split()` method (from the `re` standard library package) to be able to split the input at every empty line, represented by the regex `^$`. The flag `re.M` (which is a shortcut to `re.MULTILINE`) is important to match **each** empty line. Otherwise `^$` would match the start/end of the **whole string** only.

```python
sums = sorted([sum(l) for l in lines], reverse=True)
print(sums[0]) # the largest sum
```

### Part 2

The Elves want to know the three in the group who have the most food, to make sure that no one will run out of food during the expedition. The solution is straightforward: all we have to do is pull out the first three items from the list of sums obtained in Part 1 (i.e., the top three), and then add up these three numbers. It's as easy as

```python
print(sum(sums[:3]))
```
