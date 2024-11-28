---
title: Superior Cyber Range
desc: The Superior Cyber Range is a large scale cyber range development project which if primarily focused on provided an easily affordable system for local high schools, colleges, and universities.
date: 11/27/2024 6:30 PM
updated: 11/27/2024 6:30 PM
image: SCR.png
tags:
  - MTU
  - Cyber Security
  - Professional Development
---
# Superior Cyber Range
###### 11/27/2024

## Background:

The Superior Cyber Range project is a collaborative effort led by Michigan Technological University (MTU), in partnership with Northern Michigan University (NMU) and Baraga Community College, designed to serve the entire Upper Peninsula of Michigan and beyond. The project aims to provide a state-of-the-art, scalable, and versatile environment for cybersecurity education, training, and research. This initiative will support institutions, students, and professionals by enabling hands-on experience in realistic cyber defense and attack scenarios.
## Goals and Features

- ### Infrastructure and Distribution:
  - The range will operate on 16 high-performance servers using Proxmox as the virtualization backend.
  The design will support containerized distribution, enabling deployment at other universities or institutions.
  A centralized web server and content delivery network (CDN) will direct users to appropriate server clusters for optimal performance.
  High availability (HA), backups, and scalability are key priorities.

- ### Scenario Design and Usability:
  - The range will support 500+ scenarios, including Red/Blue team exercises, solo challenges, and collaborative environments.
  Scenarios will utilize LXC containers or VMs, depending on the need, to simulate real-world vulnerabilities such as TPM attacks.
  A JSON and Terraform-based deployment workflow ensures rapid creation of scenarios with minimal manual configuration.
  Integrated learning management system (LMS) features to support educators and administrators in scenario creation and management.

- ### Networking and Security:
  - Networks will be isolated for different groups and users, allowing secure environments with customizable SDN configurations.
  Subnets will not require internet access, ensuring a controlled learning and testing environment.

- ### Access and Integration:
  - The system will employ Single Sign-On (SSO) for seamless user authentication using providers like Google and Microsoft.
  It will integrate with other LMS platforms, such as Canvas and Blackboard, ensuring compatibility with existing educational ecosystems.

- ### Target Audience and Scope:
  - Designed for educational institutions, cybersecurity professionals, and researchers.
  Includes support for approximately 100 virtual machines per node to handle high-demand scenarios.

- ### Vision and Long-Term Plan:
  - Completion within three years, with a proof of concept (POC) and proof of value (POV) ready by mid-February for NSF funding.
  Future expansion plans include enabling other institutions across Michigan to connect to the range for improved performance.

