---
description: '🎄👨‍💻 Day 14: Regolith Reservoir'
tags:
  - aoc22
title: '🎄👨‍💻 Day 14: Regolith Reservoir'
written: 2022-12-14 13:31:00 +0000
slug: aoc22-14
---

I'm now pretty confident: I have the most problems with the implementation of an algorithm that has to do with some kind of geometry. After Day 12 and finding the path on a map using graphs, Day 14 gave me just as many troubles. I also dedicated less time on it than usual and ended up not even completing the first part[^1]. I will give a brief account of what my approach was, and keep these notes for when I return to write a complete solution.

[^1]: I found the numeric answers to the puzzle, but by disassembling and reassembling someone else's solution written in the Wolfram Language. If I don't get to the solution by my own conceptual and implementation efforts, then it counts for very little. The two stars have no _gusto_.

We ended up in a cave opening behind a huge waterfall, the point to which the signal we deciphered yesterday led us. We immediately notice that something is wrong: it is _raining sand_ in the cave. This is not comforting, so we attempt to make a quick simulation of where and how much sand may accumulate.

We have a scan of a vertical section of the cavern; or rather, of the part of the cave above us. It is full of tunnels through which the sand is threaded. The input is just the geometry in two dimensions of these burrows. We have a series of `(x, y)` points that show us the rock barriers. The `+` indicates the point where the sand enters and has coordinates `(500, 0)`.

```
......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
........#.
........#.
#########.
```

Sand, falling in small units occupying exactly one slot of the grid, accumulates according to three rules:

1. It falls straight down until it meets the first obstacle, whether sand or rock.
2. If it cannot occupy the lowest slot directly along its falling path, it slides left and then down (thus `-x → +y`).
3. If the slot on the left is not available either, it slides to the right (`+x → +y`).

In the example above, after 5 units of sand, we are at this point:

```
......+...
..........
..........
..........
....#...##
....#...#.
..###...#.
......4.#.
....5213#.
#########.
```

I have gone so far as to write a function that returns rock line paths. The puzzle input gives us the extremes of each line of rocks:

```python
def rock_line(x1, y1, x2, y2):
    """Create a line of rock points between (x1, y1) and (x2, y2)"""
    rline = []
    x1, x2, y1, y2 = map(int, (x1, x2, y1, y2))
    delta = max(abs(x1 - x2), abs(y1 - y2))
    for i in range(delta):
        rline.append([x1 + (x2 - x1) * i / delta, y1 + (y2 - y1) * i / delta])
    return rline
```

The idea now would be to build a complete map of the cave that is basically a sparse matrix: everywhere zero except the locations where we know there is rock. Then, we will need to have a function – recursive once again – that will try to get other units of sand in following the rules above. When it finds the correct position, it will change an array value from 0 to 1.

The function will then iterate over the previous result until the map itself no longer changes. At that point, we know we can no longer add sand. Any extra amount will slide into the void, that is, to the sides of the pattern shown above. The symbol `~` below indicates a unit of sand that will fall indefinitely:

```
.......+...
.......~...
......~o...
.....~ooo..
....~#ooo##
...~o#ooo#.
...~###ooo#.
..~o.oooo#.
.~o.ooooo#.
~#########.
~..........
~..........
~..........
```

### Post-scriptum

Perhaps I had little motivation today, who knows for what reason. The frenzy of Advent of Code is both a motivating drive and a risk of getting overwhelmed by wanting to get to the end at all costs. The goal is to practice how to approach a problem and, more importantly, how to translate a solution into an algorithm.

I realize that, without a formal education in computer science, I am missing several fundamental concepts that are essential tools for solving problems of this kind. For any aspiring programmer, it's mostly a matter of practice, practice, and more practice – literally. We must get our heads used to _seeing_ the logic of the solution before we put our hands on the keyboard.

How to have more practice – or rather, more sensible practice that does not make us prey to the anxiety of having to figure it all out by Christmas? Eric Wastl suggested a solution in a tweet about a year ago: there are 25 puzzles in the calendar. A year has 52 weeks. Why not read a puzzle **every two weeks**, so as to give yourself time (at least for the more complex ones) to tackle a complicated problem? In two weeks there is also time to study a bit. I might think of doing something like this from next year, although the Christmas spirit will have already waned.
