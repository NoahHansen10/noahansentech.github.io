---
title: Buffered RTSP Streams Over Starlink
desc: I messed around with buffered RTSP streams so video would stay usable even when the network gets weird over Starlink.
date: 2026-07-25T18:30:00
updated: 2026-07-25T18:30:00
tags:
  - HomeLab
  - Starlink
  - RTSP
  - Networking
  - Video
---
## Introduction:

One of the cooler things I have been working on lately was getting buffered RTSP streams behaving better over Starlink. Starlink is awesome for what it is, but it is still Starlink, so I wanted a setup that would not instantly fall apart every time the connection got a little ugly.

The main problem I was trying to deal with was that live video does not really care that much about a bad connection. If the link gets shaky, the stream just starts acting up. I wanted to make it so the video could keep going even when the network was being a little annoying.

## What I Built:

I put buffering in front of the stream so playback would have some room to breathe instead of reacting to every little hiccup right away. That was the biggest piece of it. Once that was in place, the stream stopped feeling so fragile.

After that I spent time tuning the amount of delay I was willing to live with. Too little buffering and the stream still feels jumpy. Too much and it gets annoying in the other direction. So I kept adjusting it until it felt like a good tradeoff.

I also tested it in situations that were actually realistic for me, not just in a perfect test setup. That mattered because the whole point was to make it work in the real world, not just look good on paper.

## Why It Was Cool:

This was one of those projects where the problem was just fun to solve. I was not trying to build something flashy, I just wanted to make the stream work better in a real-world setup where the internet is not always perfect.

What I liked most is that it made the whole thing feel smoother without needing a huge amount of extra hardware. It was mostly just making the software side smarter, which is the kind of thing I always like to mess with.

It also felt good because it turned into something I could actually use instead of just another idea I had tinkered with for a bit and then forgotten about.

## Result:

The end result was a stream that handled bad moments way better than the raw version. It is not magic, but it is a lot more usable, and that is exactly what I was aiming for.

It still is not the same as having a perfect wired connection, but that was never really the goal. The goal was to make the stream usable over Starlink, and it does that pretty well now.

## Next Steps:

The next thing I want to keep doing is tuning buffer size versus latency and seeing if I can get the setup even cleaner. I also want to keep using it in normal conditions just to see if anything weird shows up over time.

If I can make the setup simpler to maintain too, that would be even better, because then it turns into one of those things that just quietly works in the background.
