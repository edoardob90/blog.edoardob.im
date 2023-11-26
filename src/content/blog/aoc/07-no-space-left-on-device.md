---
description: '🎄👨‍💻 Day 7: No Space Left On Device'
tags:
  - aoc
title: '🎄👨‍💻 Day 7: No Space Left On Device'
written: 2022-12-07 22:21:24 +0000
slug: aoc22-07
---

The dreaded day came, eventually. Without a little hint, I would not have been able to pull out the solution.

The problem was not that I didn't have a clue on how to solve the puzzle, but that I was stuck with my first approach, refusing to change perspective. That is why the account of this seventh calendar day is perhaps the most important of all the previous ones. Because I found a difficulty that, at first, had completely blocked me. Then a change of point of view allowed me to find the correct solution.

Today's problem, in short. The Elves' apparatus has more than its messaging system malfunctioning. You attempt to execute a system update, but it does not go through since there is insufficient disk space available. You inspect the filesystem to examine what's happening and record the terminal output generated.

The output is very similar to what you would get on a UNIX system. The `cd` and `ls` commands are used to change and list the contents of a directory. Each file is associated with its size in bytes (?).

### Part 1

Since we have to try to free up space, the first thing to do is to calculate the size of each directory. One directory can contain others, and we have to take this into account to calculate the final size.

My initial idea was to build a data structure that was as similar as possible to the filesystem nested hierarchy. Each entity in this collection of elements had to contain, eventually, other entities (if it were a directory), or simply the name of the file and its size.

I therefore wrote this class:

```python
class Dir:
    """A Dir class"""

    def __init__(self, name):
        self.name = name
        self.children = {}
        self.parent = None
        self.size = 0

    def add(self, child, value=None):
        """Add children to Dir"""
        self.children[child] = value

    def total(self):
        """Total size of this Dir"""
        if self.children:
            for child in self.children.values():
                self.size += child.total() if isinstance(child, Dir) else child
        return self.size

    def __repr__(self):
        return f"Dir({self.children}, parent: '{self.parent.name if self.parent else None}')"
```

The `.total()` method already does what one would expect: calculate the total of a directory, following recursively any nested directory. The real stumbling block I haven't yet overcome was figuring out how to calculate the size of **individual directories**. Why? Because the puzzle clearly says that, for example, a `baz.txt` file in the `/foo/bar/` directory will contribute to the size of **both directories plus the root** `/`. I swear I was unable to write the code that would allow me to do this simple operation.

I was taking too long, so I took a detour on YouTube and was inspired by a video by [Jonathan Paulson](tab:https://www.youtube.com/@jonathanpaulson5053), a competitive programmer who almost always manages to be in the top 100 people who solve both Advent of Code puzzles. I only had to listen to how he described the problem to figure out how to rewrite the solution. The idea was very simple: simply keep track of each path and its size in a trivial dictionary and without creating a nested object.

Here’s my second attempt with the parsing function:

```python
from collections import defaultdict

def parse(puzzle_input):
    paths = []
    sizes = defaultdict(int)

    for line in puzzle_input.splitlines():
        words = line.strip().split()
        if words[1] == "cd":
            if words[2] == "..":
                paths.pop()
            else:
                paths.append(words[2])
        elif words[1] == "ls" or words[0] == "dir":
            continue
        else:
            size = int(words[0])
            for i in range(1, len(paths) + 1):
                sizes["/".join(paths[:i])] += size

	return sizes
```

For each line in the input, there are three action we can take:

1. Change directory, either down or up. If down, record append the new path to the list of paths. If up, remove the last added path (with our friend `.pop()`)
2. List the content of the directory. We simply ignore this line.
3. Read a directory’s content. If a line starts with `dir`, it indicates that the current file a directory, so we ignore it: we’re gonna explore that directory later on. If it starts with an integer, we save it.

The following bit of code it’s the interesting one. It’s where we add the size of the current file to **all directories it belongs to**. That is, to all of its parents up to `/`. We perform a loop over the parents paths, we build a nice UNIX-like path string, and then add the file size.

```python
size = int(words[0])
for i in range(1, len(paths) + 1):
   sizes["/".join(paths[:i])] += size
```

Part 1 asks us to find all the directories that are **at most** `100 000` in size. That’s pretty easy with our `sizes` dictionary:

```python
def part1(data):
    total = 0
    for size in data.values():
        if size <= 100_000:
            total += size
    return total
```

### Part 2

The second part asks us to find the smallest directory that would allow running the upgrade. We know the total space available and the space required by the update. Thus:

```python
avail = 70_000_000
needed = 30_000_000
max_used = avail - needed
free = data["/"] - max_used
```

The `max_used` is the maximum space we are **allowed to use**. The minimum space we need to free up is the total space we're occupying, `data['/']` – the space of the root directory – minus the allowed maximum. It means two operations: a filtering and then sorting.

```python
def part2(data):
    avail = 70_000_000
    needed = 30_000_000
    max_used = avail - needed
    free = data["/"] - max_used

    candidates = list(filter(lambda s: s >= free, data.values()))

    return sorted(candidates)[0]
```

Day 7 is done, but I have to thank Jonathan Paulson because, without his hint, I doubt I would have been able to finish today. But that's what happen when you're trying to learn, right? You push yourself until it's not longer easy and you're stuck with a seemingly insurmountable difficulty. Then, with the help of someone more experienced or by studying the subject a little more, one is often able to overcome the stumbling block. And it is this experience that, as it accumulates, makes all the difference in the world in any learning process.

> “Hey, Edoardo, do you have also a nice and elegant solution in the Wolfram Language?”
>
> “Next time, my friend. Perhaps as a Christmas present. Now I'm pretty satisfied with what I got.”
