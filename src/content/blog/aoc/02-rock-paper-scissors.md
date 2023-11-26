---
description: '🎄👨‍💻 Day 2: Rock Paper Scissors'
tags:
  - aoc
title: '🎄👨‍💻 Day 2: Rock Paper Scissors'
written: 2022-12-02 21:54:21 +0000
slug: aoc22-02
---

Second day, second warm-up.

The Elves are setting up base camp before venturing into the jungle. To decide who will get the best-positioned tent – that is, the one closest to the food supply meticulously calculated yesterday – the Elves are holding a Rock-Paper-Scissors tournament. The rules are the standard ones, but the scoring will be done as follows:

- 1, 2, and 3 points are awarded to rock (indicated by A), paper (B), scissors (C), respectively;
- Outcome points: 6 points for a win, 3 for a tie, and zero otherwise.

The input is the secret key provided to us by a friendly Elf so that we can easily win the tournament. There's not much structure and it's quite easy to parse, only a bunch of rows with two letters.

### Part 1

The problem is on the interpretation of the input: we do not know what the second column indicates, where X, Y, and Z stand for rock, paper, and scissors.

We make an hypothesis: if the second column represents our choice during a single match, then we need only add the value associated with the character (`A=1`, `B=2`, `C=3`) in the second column to that of the outcome of the game.

```python
def part1(data):
    """Solve part 1"""
    POINTS = {"X": 1, "Y": 2, "Z": 3}

    total_points = 0

    for line in data:
        opp, me = line.split()
        total_points += POINTS[me]
        if opp == "A":
            if me == "X":
                total_points += 3
            elif me == "Y":
                total_points += 6
        elif opp == "B":
            if me == "Y":
                total_points += 3
            elif me == "Z":
                total_points += 6
        else:
            if me == "Z":
                total_points += 3
            elif me == "X":
                total_points += 6

    return total_points
```

### Part 2

There's a second possibility, which turns out to be the correct one: the second column means the outcome that the game needs to have. In fact, it would be very suspicious if we won every game; someone would suspect that we are cheating (as we are).

In this case, we already know the score of the final outcome – that's the score associated to X (0, lose), Y (3, draw), and Z (6, win). We have to find which choice between rock-paper-scissors will produce that outcome. The first column always represents our opponent's choice.

We only need a couple more `if...else`, but the solution is fairly easy:

```python
def part2(data):
    """
    Solve part 2

    X = lose
    Y = draw
    Z = win
    """
    ENDS = {"X": 0, "Y": 3, "Z": 6}

    total_points = 0

    for line in data:
        opp, end = line.split()
        total_points += ENDS[end]
        # lose
        if end == "X":
            if opp == "A": # rock
                total_points += 3
            elif opp == "B": # paper
                total_points += 1
            else:
                total_points += 2
        # draw
        elif end == "Y":
            if opp == "A": # rock
                total_points += 1
            elif opp == "B": # paper
                total_points += 2
            else:
                total_points += 3
        # win
        else:
            if opp == "A": # rock
                total_points += 2
            elif opp == "B": # paper
                total_points += 3
            else:
                total_points += 1

	return total_points
```

### A very elegant solution (not mine)

One could say very _Pythonic_. It takes full advantage of the versatility of dictionaries[^1] and the sum operation between two strings which means to concatenate.

First, we create a dictionary that stores the values of the single choices (`A=X=1`, `B=Y=2`, `C=Z=3`) and the **9 possible outcomes** (`AX`, `AY`, `AZ`, etc...).

```python

points = dict(X=1, Y=2, Z=3,
             AX=3, AY=6, AZ=0,
             BX=0, BY=3, BZ=6,
             CX=6, CY=0, CZ=3)
```

The first part is practically solved in one line, without even an `if...else` block:

```python

total_points = sum(points[me] + points[me + opp]
				   for opp, me in [line.split()
				   for line in open('input.txt').readlines()])
```

Wow 🤯.

[^1]: Review: a built-in data-structure of key-value pairs
