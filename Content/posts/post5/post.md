---
title: HomeLab
desc: HomeLab is a personal project focused on building and maintaining a home-based lab environment for learning and experimentation in various technology domains, including cybersecurity, networking, and system administration. The project aims to provide a hands-on learning experience by setting up and configuring different hardware and software components to create a versatile and functional lab environment.
date: 2026-02-21T18:30:00
updated: 2026-02-21T18:30:00
image: download.png
tags:
  - HomeLab
---
# Introduction
Over the past few weeks, I completed a significant infrastructure refresh in my homelab environment. The updates focused on:

- Migrating core routing and segmentation to a Palo Alto PA-440
- Stabilizing and properly segmenting GlobalProtect VPN access
- Cleaning up VLAN and routing design across Proxmox

## Core Components
#### Firewall & Edge
- PA440 for routing and segmentation
- PFsense Box for backup and testing

#### Layer 3 VLAN interfaces
 - NAT + security policies
 - GlobalProtect remote access
 - Internal segmentation enforcement

#### Virtualization
 - Proxmox VE 
 - TrueNas Scale
 - VM tagging for automation


#### Multi-VLAN trunking
 - Isolated homelab networks
 - SDN cleanup

#### Storage
 - TrueNAS
 - SSD-backed VM datastore
 - ~40TB HDD bulk storage pool
 - Tier separation for performance vs capacity workloads

## Architecture Overview

#### Network Layout
The PA-440 now acts as the primary L3 gateway for:
- VLAN 10 – Wireless/IoT
- VLAN 20 – Management
- VLAN 30 – StS VPN's
- VLAN 40 – Internal Trusted
- VLAN 200 – DMZ/Untrusted

Proxmox nodes are connected via trunk ports and pass VLAN tags directly to VMs.

Key change: I eliminated overlapping subnets between Proxmox management and guest networks, which was causing asymmetric routing and inconsistent firewall behavior.
