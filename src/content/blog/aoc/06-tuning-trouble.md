---
description: '🎄👨‍💻 Day 6: Tuning Trouble'
tags:
  - aoc
title: '🎄👨‍💻 Day 6: Tuning Trouble'
written: 2022-12-06 15:30:13 +0000
slug: ao22-06
---

The preparation phase is finally over, and the expedition in the jungle can begin. You and the Elves set off on foot, each with their backpack filled only with what you’ll need (hopefully). Suddenly, one of the Elves hands you a device. “It has fancy features,” he says, “but you need to set up its communication system right away.” He adds with a grin, ”I heard you know your way around signal-based systems - so this one should be easy for you!” They gave you an old, malfunctioning device that you need to fix. ‘Thanks a lot, friends!’

No sooner had he finished speaking, some sparks signal that the device is partially working! You realize it needs to lock onto their signal. To make it work as it should, you must create a subroutine that detects when four unique characters appear in sequence; this indicates the start of a packet in the communication data-stream.

Your task is clear: given an input buffer, find and report how many characters there are from its beginning to the end of that four-character marker.

### Part 1

If we can scan the input and split it in **overlapping subsequences of 4 chars**, then we could compare them and find the first one that doesn’t contain duplicates characters. That one would be our marker string.

We need to have a utility function for that purpose. It should behave as if a four-characters wide windows scrolled over the string. The offset between one substring and the next is exactly one character. We also need to consider that we might end up with strings that are shorter than the target length if there are not enough characters left.

Here’s our `partition()` function:

```python
def partition(l, n, d=None, upto=True):
    """
       Generate sublists of `l`
       with length up to `n` and offset `d`
    """
    offset = d or n
    return [
        lx for i in range(0, len(l), offset)
        if upto or len(lx := l[i : i + n]) == n
    ]
```

To obtain the solution, we need to transform each sublist into a set to remove any duplicates. Only the resulting sets whose length is still 4 characters are potential candidates for our marker string. We can filter out the others and take the first one. Then, find the index in the original string where our substring starts. Python has the `str.find(substr)` method for that precise purpose.

```python
def part1(data):
    pdata = list(map(set, partition(data, n=4, d=1, upto=False)))
    marker = list(filter(lambda x: len(x) == 4, pdata))[0]
    return ("".join(data)).find("".join(marker)) + 4
```

<br>

Why are we summing 4 at the end? Because the puzzle asks for _“the number of characters from the beginning of the buffer to the end of the first such four-character marker.”_

### Part 2

There’s a slight plot twist: we also need to decode the start of messages with another, appropriate marker. This time, the marker string is 14 characters long. Once again, our `partition()` function is versatile enough: we only need to change the offset argument to 14. The code is identical to Part 1's.

### My source of inspiration

As I was able to find the complete solution in a short time, I took some time to make some comparisons with another programming language. A particularly special language since it was the first one I learned: the Wolfram Language (now “WL” for short). For this kind of tasks, it really excels, I have to say. The idea of implementing the `partition()` function came from remembering that WL has an identical function with [many, many more options](http://reference.wolfram.com/language/ref/Partition.html).

The elegance of the solution written in WL is astonishing (but, as I said, I'm completely biased). I let the reader judge by themselves.

```wolfram
With[{sample = inputDay6},
 Flatten/*Last@
  StringPosition[sample,
   StringJoin@Select[
     Partition[Characters@sample, 4, 1],
     DuplicateFreeQ, 1]
   ]
 ]
```
