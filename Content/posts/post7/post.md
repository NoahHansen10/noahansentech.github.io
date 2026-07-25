---
title: Sephora and Ansible VM Automation
desc: I set up Sephora with Ansible so I could automatically manage VMs and containers instead of doing everything by hand.
date: 2026-07-24T18:30:00
updated: 2026-07-24T18:30:00
tags:
  - HomeLab
  - Ansible
  - Automation
  - Proxmox
  - VMs
  - CTs
---
## Introduction:

Another thing I spent time on was getting Sephora hooked into Ansible for VM and container management. I wanted something that would make repetitive lab stuff way less annoying and make it easier to spin things up consistently.

The main idea was pretty simple. I did not want to keep doing the same setup work by hand every time I needed a VM or a container. That gets old fast, and it is way easier to make mistakes when you are repeating the same thing over and over.

What I ended up building was a workflow that could handle provisioning, configuration, and inventory updates in one pass instead of having those live as separate manual steps.

## What I Did:

I started by getting Ansible pointed at the systems I wanted to manage and then worked through the pieces needed for the VM and container workflow. Once that was in place, I wired Sephora into it so the setup felt cleaner and more organized.

From there I started turning the boring repeated tasks into something repeatable. Things like creating systems, applying the same configuration, and keeping things lined up the same way every time are exactly the kind of tasks I want automation to handle.

I also hooked the whole thing into NetBox so I could automatically record what gets created. That part matters a lot because it means I am not just building VMs and containers, I am also keeping the inventory updated at the same time instead of going back and cleaning it up later.

So when something gets deployed, the record shows up alongside it. That makes NetBox a lot more useful as a source of truth for the lab because I can see what exists, where it lives, and how it fits into everything else without having to rely on memory.

In practice that means the workflow is not just provisioning a guest and stopping there. It is also pushing the metadata that goes with it so the lab inventory stays current. That includes keeping track of the VM or CT name, where it belongs, and the fact that it actually exists now.

I like that setup a lot more than trying to clean up inventory after the fact because that usually turns into something I will eventually forget to do.

The nice part is that once I had the workflow together, it started feeling like a real system instead of a pile of commands I had to remember.

## Why I Liked This One:

This kind of work is honestly just satisfying. Instead of clicking through the same setup over and over, I can let automation do the boring part and spend my time on the interesting part.

It also makes the whole lab feel more like an actual system instead of a collection of one-off machines. I like when things start feeling connected instead of random.

Another good part is that it cuts down on the little mistakes that happen when you are doing everything manually. Automation makes it easier to stay consistent, and consistency is usually what makes a lab easier to live with.

It also gives me a much better chance of keeping the environment documented as it changes. Once the automation and the inventory are tied together, the source of truth stays much closer to reality.

## Result:

The big win here is consistency. If I need another VM or container, I am not rebuilding the process from scratch every time. I can just run the workflow and know it is going to come up the same way.

It also makes it easier to keep the setup growing without turning into a mess. That matters a lot in a homelab, because it is really easy for things to become disorganized if you are not careful.

Having NetBox in the loop helps with that a lot too. If I spin something up, I want the record of it to show up right away so I am not relying on memory or trying to go back and clean up the notes later.

That ends up being really useful when the environment gets bigger, because I can look at the inventory and immediately know what is deployed instead of having to dig around and piece it together myself.

## Next Steps:

The next thing I want to do is keep adding more of the repeatable tasks into automation. The more I can move into playbooks, the less time I spend doing the same setup work again.

I also want to keep cleaning up the playbooks as the setup evolves, because that is usually how these things stay useful instead of becoming a pile of old scripts nobody wants to touch.

Long term I want the provisioning side and the inventory side to stay basically in sync all the time so I do not have to think about them as separate jobs.
