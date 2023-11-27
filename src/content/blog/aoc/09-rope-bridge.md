---
description: '🎄👨‍💻 Day 9: Rope Bridge'
tags:
  - aoc
title: '🎄👨‍💻 Day 9: Rope Bridge'
written: 2022-12-09 18:08:39 +0000
slug: aoc22-09
---

If this Advent of Code 2022 ended tomorrow, I could say with certainty that I have learned at least one fundamental thing: I'm struggling the most when translating a solution that is crystal clear in my head using the “words” of an algorithmic vocabulary. Any one. I read the text, understand the problem, and intuit the solution; for a simple example, I even manage to write it down with pen and paper (when possible). Then I get stuck when I ask myself, “and now how do I tell a computer to follow this reasoning and arrive at the result?”

Today's puzzle is another Advent of Code classic: you have to navigate a two-dimensional grid of dots by following certain rules. Often the question is to count how many times you pass over a grid point or how many locations have never been visited. The interesting part is _how_ you have to move around the grid.

Today's back-story was slightly absurd, but only a little. Planck's length even came up – just because it's cool to mention it. It is fun to follow the rambling vicissitudes of these Elves, though. After all, it only serves the purpose of introducing the problem.

### Part 1

We have a rope with two knots at each end. Each node can move along a grid of points, but obviously both are constrained to follow each other. The two nodes will tend to stay as close as possible. The distances between the two knots apply in all directions, **even diagonally**. The two ends of the string can also overlap, the most trivial case of adjacency.

The knots can move along the grid according to the following rules:

- If the head node moves two steps in any direction along the XY Cartesian axes, the tail node will move an equal number of steps in the same direction.

- If, after a move, the nodes are no longer adjacent and are **neither on the same row and column**, then the tail node will move **diagonally** by one step. Keep this rule in mind for Part 2.

Our input is a series of movements. Each line, two columns: the first character indicates the direction, the second the number of steps. We are asked to determine which grid points the tail node visits **at least once**.

Very schematically, for each move we must:

1. Update the position of the leading node.
2. Determine where the tail node will end up (it might even stay where it is).
3. Add the new location of the tail node somewhere. Eventually, it will suffice to count the elements in this list. Since we are interested in points visited **at least once**, we must ignore any duplicates. It is possible for a node to pass over a point more than once, if the trajectory described by the input is [a bit convoluted](<https://en.wikipedia.org/wiki/Snake_(video_game_genre)>).

The most interesting part is step 2: determining how to update the tail coordinates. There are four possibilities:

1. The head knot moves along the X axis: the Y coordinate of the tail remains the same, while the X will change by `+1/-1`, depending on the direction.
2. The head moves along the Y axis: as above, but we will update the Y coordinate.
3. The head moves diagonally: here we need to update both coordinates, combining what we did for X and Y separately.

There is a really important detail to point out, but first we need the code for this function called `move(H, T)`, with a spark of imagination:

```python
def move(H, T):
    """Adjust position of Tail w.r.t. Head, if need be"""
    xh, yh = H
    xt, yt = T

    dx = abs(xh - xt)
    dy = abs(yh - yt)

    if dx <= 1 and dy <= 1:
        # do nothing
        pass
    elif dx >= 2 and dy >= 2:
        # move both
        T = (xh - 1 if xt < xh else xh + 1, yh - 1 if yt < yh else yh + 1)
    elif dx >= 2:
        # move only x
        T = (xh - 1 if xt < xh else xh + 1, yh)
    elif dy >= 2:
        # move only y
        T = (xh, yh - 1 if yt < yh else yh + 1)

    return T
```

Let's try to understand the last `elif dy >= 2` block. If we said that X remains unchanged, why are we substituting the X coordinate `xh` **of the head node**? Because the two nodes can also be diagonally adjacent; in this case, the tail node will have to make a diagonal jump. Here's a ridiculously simple example to clarify:

```
  (a)       (b)
......    ......
......    ....H.
....H.    ....*.
...T..    ...T..
```

When `H` moves from `(4, 1)` in (a) to `(4, 2)` in (b), `T` will have to move to the point indicated by `*`. The coordinates of `T` are `(3, 0)`, and the distances are `dx = 1` and `dx = 2`. If we left the X of `T` unchanged, **it would not move at all along X!** This is why we substitute the X of `H`. In the trivial case where `H` was moving up and `T` was exactly below, it would be irrelevant which X coordinate we keep.

The gist of the first part is all here. The rest of the code to get the solution is

```python
delta_x = {"L": 1, "R": -1, "U": 0, "D": 0}
delta_y = {"L": 0, "R": 0, "U": 1, "D": -1}


def part1(data):
    H = (0, 0)
    T = (0, 0)
    tail_path = set([T])
    for direction, step in data:
        for _ in range(int(step)):
            # Update the head's position
            H = (
                H[0] + delta_x[direction],
                H[1] + delta_y[direction]
            )
            # Update the tail's position
            T = move(H, T)
            tail_path.add(T)

    return len(tail_path)
```

Where the two dictionaries `delta_x` and `delta_y` simplify a lot the update of the coordinates of `H`, which can be done in a single, neat line.

### Part 2

Only two knots?! What is this trivial and boring stuff? Why don't we use a rope of 10 knots! Sure, no problem, because we just need to update all nodes **in pairs** according to the same rules.

I must admit that my first implementation did not use the above function `move()`, but a more trivial one that simply determined whether node `T` should move or not. If yes, the position of `T` would be updated to the **penultimate** position of `H`.

Unfortunately, this method does not work with more than two nodes: there are multiple ways to move a node that bring it back adjacent to its nearest companion. The correct one is only the one that keeps the two nodes **at the minimum distance**. Another trivial example:

```
  (a)       (b)
......    ......
......    ....H.
....H.    ...*1.
4321..    432*..
```

The node `2` could move to either position indicated by `*` because both satisfy the adjacency criterion. But only one of them is at the minimum distance, namely the one immediately to the left of `1`. By the same reasoning, also the other nodes should move up, and not to the left. It was the tricky detail of Part 2, but the function `move()` is general enough to deal with this scenario.

The code to solve Part 2 is only a tiny bit more complicated than Part 1: we basically have to add an extra `for` loop:

```python
def part2(data):
    H = (0, 0)
    T = [(0, 0) for _ in range(9)]
    tail_path = set([T[-1]])
    for direction, step in data:
        for _ in range(int(step)):
            # Update the head's position
            H = (
                H[0] + delta_x[direction],
                H[1] + delta_y[direction]
            )
            # Update the first point that follows the head
            T[0] = move(H, T[0])
            # Update the remaining points
            for i in range(1, 9):
                T[i] = move(T[i - 1], T[i])
            # Add the tail's position to the path
            tail_path.add(T[-1])

    return len(tail_path)
```

After reading the puzzle's text, I wanted to come up with some nice visualization of the strand moving on the grid, but I don't have (yet) a clue on how to do that. I'll collect all the puzzles where it could be fun to add some graphics and see to which one I can come back later. Now, I'll pat on my shoulder for Day 9's two stars! ⭐⭐
