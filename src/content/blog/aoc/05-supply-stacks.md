---
description: '🎄👨‍💻 Day 5: Supply Stacks'
tags:
  - aoc22
title: '🎄👨‍💻 Day 5: Supply Stacks'
written: 2022-12-05 22:10:11 +0000
slug: aoc22-05
---

It's starting to get serious today, at least as far as input parsing is concerned. The Elves are still in the process of unloading the materials needed for the expedition. On the cargo ship, the material is arranged in crates stacked in a certain order. It would be too easy (and unrealistic) if we could unload all the crates. The ones we need are scattered on the ship, piled in different groups.

The ship's operator is quick to determining in what order to move the crates so as to retrieve those that the Elves need. They, however, forgetful as they are, do not remember which crates will be the ones they can unload **first**, that is, the ones that will be at the top of each stack at the end of the “sorting” procedure.

### Part 1

The input is divided into two parts. The first, the different stacks with crates before the intervention of the operator. The second, the list of rearrangement operations. It is the first part that is problematic. The example input reads[^1]

```plaintext
    [D]
[N] [C]
[Z] [M] [P]
1   2   3
```

[^1]: This website has a broken code formatting parser. Check out [here](tab:https://adventofcode.com/2022/day/5) for the correct one. Sorry, reader.

If the operator were to move 2 crates from the second to the third stack, for example, she will move **one at a time**. Which means that the order of the crates will be reversed: the first crate moved will end up as far back as possible in the stack to which it is moved.

In order to handle crate stacks as if they were lists, we need to find a way to convert a list like `[[D], [N,C], [Z,M,P]]` to `[[Z,N], [M,C,D], [P]]`. Unfortunately, this is not a simple transposition, but two operations are needed:

1. Reverse the matrix, that is, read it row-by-row from the bottom

2. Now transpose the matrix

For the two steps to work, one more thing is necessary: you must keep the blanks. For example, the first line **cannot be** `[ [D] ]`, but must be `[ [blank, D, blank] ]`.

There is another problem to handle in parsing the input if we want the transpose operation to make sense: the array must be square, or at least rectangular.

The steps to parse the input are the following:

1. Split the stacks initial configuration from the rearrangement procedure (easy: it’s just a double `\n\n`)

2. Save how many columns we have, that’s important. It can be done by counting the number of digits at the very bottom of the stacks configuration

3. Read the list of moves. I used the regular expression `r"move (\d+) from (\d) to (\d)"` to read in a tuple like `(num, src, dest`): `num` is how many crates are moved, `src` from which stack and `dest` to which one

And now, the fun part. To process the stacks configuration and obtain our matrix, we need to:

1. Read each line of the stacks section and strip any non-letter character. We also replace any empty “slot” with a dot (`.`) placeholder, needed to have a square, transposable matrix

2. If the number of `rows` is less than the number of `cols`, we need to add extra rows (filled with dots). Again, that’s to obtain a square matrix. How many rows? Enough to have `rows == cols`, that is, `["." * cols] * (cols - rows)`

3. Now we can transform our matrix. We reverse it first, and then transpose rows and columns

4. Last step: we get rid of all the dot placeholders, which represent non-existent crates (or empty ones, if you want). This can be done with `filter(lambda x: x != ".", stack)`

I’m 99% sure that’s not the easiest or clearest way, but I had so much fun in trying to implement this matrix approach[^2]. The problem resembles a lot the Hanoi Towers’ puzzle, and I bet there are hundreds of schemes or algorithms to solve it.

[^2]: The complete solution is [here](tab:https://github.com/edoardob90/aoc2022/blob/main/5/5.py).

To obtain the answer to Part 1, we only need to process our stacks according to the list of moves. Remember: we must move the crates **one by one**. That’s easy enough now that we have our matrix of stacks:

```python
def part1(data):
    stacks, moves = data
    for num, src, dest in moves:
        s, d, n = int(src) - 1, int(dest) - 1, int(num)
        for _ in range(n):
            stacks[d].append(stacks[s].pop())
    return "".join(map(lambda x: x[-1], stacks))
```

We also need to decrement all the indexes in each move because Python counts from zero. The `return` statement simply takes the **topmost** crate in each stack and then joins the characters to get the final answer 🎉.

### Part 2

It has to be expected: it turns out that the “giant cargo crane” can move more than one crate at a time. Even better: as many as we want. The code change is minimal because the bulk of the work was reading and saving the crates stack in the right way.

The only thing that changes is that we don't need the loop `for _ in range(n)` because we can move more than one crate at a time. We also cannot use `pop()` because it does not support a range, so we have to do it by hand: extract the elements we are interested in and then delete them.

```python
def part2(data):
    stacks, moves = data
    for num, src, dest in moves:
        s, d, n = int(src) - 1, int(dest) - 1, int(num)
        stacks[d].extend(stacks[s][-n:])
        del stacks[s][-n:]
    return "".join(map(lambda x: x[-1], stacks))
```

<br>
It's 11:59 pm, and Day 5 is finally over. Unexpectedly tough.
