IMAGE SLOTS
===========

Drop your real images in this folder using EXACTLY these filenames. The app
picks them up on refresh. No rebuild needed if you are editing dist/assets/.

The files here now are grey placeholders, not artwork. Replace them.

  hero.jpg        1080 x 980   Wide photo band across the start screen.
  panel.jpg        560 x 700   Curved photo panel, top-right of the
                               question and result screens.
  farm.jpg         560 x 400   Start screen thumbnail 1  ("From Farm")
  processing.jpg   560 x 400   Start screen thumbnail 2  ("To Food Processing")
  people.jpg       560 x 400   Start screen thumbnail 3  ("To People")

Notes
-----
* Sizes above are the recommended pixel dimensions. Anything close works:
  images are object-fit: cover, so they fill the slot and crop the overflow
  rather than stretching.
* Keep the .jpg extension, or update the paths in src/assets.js.
* A missing or broken file degrades to a plain grey block. It will never
  show a broken-image icon on the kiosk.
* The whole UI is laid out on a 1080 x 1920 (9:16) canvas and scaled to the
  screen, so these dimensions stay correct at any panel resolution.
* To change the thumbnail captions, edit THUMBS in src/screens/Start.jsx.
