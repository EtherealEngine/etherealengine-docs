---
draft: true
---

# Mocap

## Overview
The motion capture page allows you to animate your avatar using your own body movements recorded via webcam. We use Mediapipe with your video feed to output landmark data which is then converted to rotations on the limbs and trunk of your avatar, and root motion for the hips. This is set to the normalized rig, and then retargeted onto the actual raw rig of your avatar.