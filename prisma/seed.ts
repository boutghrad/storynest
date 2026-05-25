import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data
  await prisma.userBadge.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.bookmark.deleteMany()
  await prisma.readingHistory.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.storyTag.deleteMany()
  await prisma.storyCategory.deleteMany()
  await prisma.story.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.childProfile.deleteMany()
  await prisma.author.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()

  // ==========================================
  // CATEGORIES
  // ==========================================
  console.log('📦 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Adventure',
        slug: 'adventure',
        description: 'Thrilling journeys and exciting quests for brave young explorers',
        icon: '🗺️',
        color: '#F59E0B',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fantasy',
        slug: 'fantasy',
        description: 'Magical worlds filled with wonder, spells, and mythical creatures',
        icon: '🧙',
        color: '#8B5CF6',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bedtime',
        slug: 'bedtime',
        description: 'Soothing tales perfect for winding down before sleep',
        icon: '🌙',
        color: '#3B82F6',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Educational',
        slug: 'educational',
        description: 'Fun stories that teach science, math, and life lessons',
        icon: '📚',
        color: '#10B981',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Animals',
        slug: 'animals',
        description: 'Heartwarming tales about our furry, feathered, and scaly friends',
        icon: '🐾',
        color: '#EF4444',
        order: 5,
      },
    }),
  ])

  // ==========================================
  // TAGS
  // ==========================================
  console.log('🏷️ Creating tags...')
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'magic', slug: 'magic' } }),
    prisma.tag.create({ data: { name: 'friendship', slug: 'friendship' } }),
    prisma.tag.create({ data: { name: 'nature', slug: 'nature' } }),
    prisma.tag.create({ data: { name: 'space', slug: 'space' } }),
    prisma.tag.create({ data: { name: 'ocean', slug: 'ocean' } }),
    prisma.tag.create({ data: { name: 'dragons', slug: 'dragons' } }),
    prisma.tag.create({ data: { name: 'princess', slug: 'princess' } }),
    prisma.tag.create({ data: { name: 'robots', slug: 'robots' } }),
    prisma.tag.create({ data: { name: 'forest', slug: 'forest' } }),
    prisma.tag.create({ data: { name: 'music', slug: 'music' } }),
  ])

  // ==========================================
  // USERS
  // ==========================================
  console.log('👤 Creating users...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@storynest.com',
      name: 'Admin Owl',
      password: 'password123',
      role: 'admin',
      image: '🦉',
      emailVerified: true,
      readingStreak: 42,
      lastReadAt: new Date(),
    },
  })

  const authorUser = await prisma.user.create({
    data: {
      email: 'author@storynest.com',
      name: 'Luna Storyweaver',
      password: 'password123',
      role: 'author',
      image: '✍️',
      emailVerified: true,
      readingStreak: 28,
      lastReadAt: new Date(),
    },
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@storynest.com',
      name: 'Little Reader',
      password: 'password123',
      role: 'user',
      image: '🧒',
      emailVerified: true,
      readingStreak: 15,
      lastReadAt: new Date(),
    },
  })

  // ==========================================
  // AUTHOR PROFILES
  // ==========================================
  console.log('✍️ Creating author profiles...')
  const author1 = await prisma.author.create({
    data: {
      userId: authorUser.id,
      bio: 'Luna Storyweaver has been enchanting children with her magical tales for over a decade. Her stories have been translated into 12 languages and loved by millions of young readers around the world.',
      website: 'https://lunastoryweaver.com',
      avatar: '✍️',
      verified: true,
    },
  })

  const author2 = await prisma.author.create({
    data: {
      userId: adminUser.id,
      bio: 'Admin Owl is the wise guardian of StoryNest. When not managing the platform, Admin Owl crafts whimsical bedtime stories that help little ones drift off to dreamland.',
      website: 'https://storynest.com',
      avatar: '🦉',
      verified: true,
    },
  })

  // ==========================================
  // STORIES
  // ==========================================
  console.log('📖 Creating stories...')

  // Story 1: The Dragon's Garden
  const story1 = await prisma.story.create({
    data: {
      title: "The Dragon's Garden",
      slug: 'the-dragons-garden',
      description: 'A gentle dragon discovers a magical garden and learns that the most beautiful things grow when you share them with friends.',
      coverImage: '/stories/dragons-garden.png',
      ageMin: 4,
      ageMax: 8,
      featured: true,
      trending: true,
      published: true,
      premium: false,
      readCount: 2847,
      favoriteCount: 423,
      rating: 4.8,
      ratingCount: 156,
      duration: 12,
      authorId: author1.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Adventure
          { categoryId: categories[4].id }, // Animals
        ],
      },
      tags: {
        create: [
          { tagId: tags[0].id }, // magic
          { tagId: tags[1].id }, // friendship
          { tagId: tags[5].id }, // dragons
        ],
      },
      chapters: {
        create: [
          {
            title: 'The Hidden Path',
            content: `Deep in the Misty Mountains, where clouds wrapped around the peaks like cozy blankets, there lived a dragon named Ember. Unlike the fearsome dragons in storybooks, Ember had shimmering emerald scales that sparkled like morning dew, and eyes as warm as honey.

Every morning, Ember would stretch her wings and fly over the mountain village below. The children would wave and shout, "Good morning, Ember!" and she would puff a little cloud of sparkles their way — her favorite way of saying hello.

One day, while exploring a forgotten trail behind the waterfall, Ember noticed something strange. Between two ancient oak trees, there was a door made of woven vines. It was so well hidden that you'd never see it unless you looked very, very carefully.

"What's this?" Ember whispered, her tail swishing with curiosity.

She pushed the vine door open with her snout, and what she saw made her gasp. It was a garden — but not just any garden. The flowers glowed with soft light, like tiny lanterns. The trees had leaves of silver and gold. A crystal stream wound through the center, and everywhere, butterflies the size of dinner plates danced in the air.

"Hello?" Ember called out softly.

No one answered. The garden seemed to be waiting — waiting for someone to care for it, to love it, to share it.`,
            order: 1,
            duration: 3,
          },
          {
            title: 'The Lonely Garden',
            content: `Ember spent the whole day exploring the magical garden. She discovered that when she breathed gently on the flowers, they bloomed brighter. When she hummed, the crystal stream sang along. When she touched the silver trees, their leaves chimed like tiny bells.

"This is the most wonderful place in the whole world," Ember said, twirling around with joy. But then she stopped. The garden was beautiful, but it was silent except for the wind and water. There was no one to share it with.

Back in the village, Ember couldn't stop thinking about the garden. She visited every day, tending to the flowers, talking to the butterflies, and filling the air with her happy humming. The garden grew more beautiful each day, but something was missing.

"You look sad, Ember," said Pip, a little squirrel who always sat on her tail.

"I found the most amazing garden," Ember sighed, "but it feels empty. Beautiful things are only truly beautiful when you share them."

Pip's eyes grew wide. "Can I see it? Please, please, please?"

Ember thought for a moment. What if the garden didn't want visitors? What if something went wrong? But then she looked at Pip's hopeful little face and made a decision.

"Come with me," she smiled.`,
            order: 2,
            duration: 3,
          },
          {
            title: 'Friends Arrive',
            content: `When Pip saw the garden, he couldn't believe his eyes. He scampered up the silver tree and chattered with delight. "This is INCREDIBLE, Ember!"

The garden seemed to respond to Pip's excitement. The flowers turned toward him like sunflowers following the sun. The butterflies landed on his bushy tail, tickling him until he giggled.

The next day, Ember invited Luna the rabbit. Luna brought her favorite carrots and planted them in a cozy corner of the garden. To everyone's surprise, the carrots grew into carrot-lanterns that glowed orange in the dark!

Then came Oliver the owl, who loved to read. He found a quiet spot under a golden tree where the leaves made the most beautiful music while he told stories. And soon, the whole village knew about Ember's garden.

Each animal brought something special. The beavers built a tiny bridge over the crystal stream. The songbirds added their melodies to Ember's humming. The fireflies came at night, making the garden look like it was filled with fallen stars.

"See?" said Pip, sitting on Ember's head. "I told you it would be even better with friends!"

Ember smiled, her heart so full it could have burst into a thousand sparkles. Pip was right. The garden had been beautiful before, but now it was magical — because it was filled with love, laughter, and the joy of sharing.`,
            order: 3,
            duration: 3,
          },
          {
            title: 'The Garden Grows',
            content: `As the seasons changed, Ember's garden became the heart of the mountain village. Every creature, big and small, had a special place there.

In spring, the garden burst with cherry blossoms that the wind carried through the village like pink snow. In summer, the crystal stream cooled tired paws and wings. In autumn, the golden leaves made the best piles for jumping. And in winter, the glow from the flowers kept everyone warm.

One evening, as the sun painted the sky in shades of orange and pink, Ember sat at the top of the garden, looking down at all her friends. Luna was teaching baby bunnies to hop over the stream. Oliver was reading a story to a circle of wide-eyed hedgehogs. Pip was juggling acorns for the laughing field mice.

"Thank you," Ember whispered to the garden. "You taught me the most important magic of all."

The garden's flowers glowed a little brighter, as if to say, "You're welcome."

And from that day on, whenever any creature in the village felt lonely or sad, they knew exactly where to go — to Ember's garden, where friendship bloomed in every corner, and where a gentle dragon's love made the world a little more magical.

The End. 🐉🌸`,
            order: 4,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 2: Starlight's Journey
  const story2 = await prisma.story.create({
    data: {
      title: "Starlight's Journey",
      slug: 'starlights-journey',
      description: 'A little star falls from the sky and must find her way home with the help of new friends she meets along the way.',
      coverImage: '/stories/starlights-journey.png',
      ageMin: 3,
      ageMax: 7,
      featured: true,
      trending: false,
      published: true,
      premium: false,
      readCount: 1923,
      favoriteCount: 312,
      rating: 4.9,
      ratingCount: 89,
      duration: 10,
      authorId: author2.id,
      categories: {
        create: [
          { categoryId: categories[1].id }, // Fantasy
          { categoryId: categories[2].id }, // Bedtime
        ],
      },
      tags: {
        create: [
          { tagId: tags[0].id }, // magic
          { tagId: tags[3].id }, // space
          { tagId: tags[1].id }, // friendship
        ],
      },
      chapters: {
        create: [
          {
            title: 'Falling Star',
            content: `High above the world, in the great blanket of night, lived a little star named Starlight. She was the smallest star in the sky, but she had the biggest twinkle.

Every evening, Starlight would wiggle and giggle until she shone her brightest. "Look at me!" she'd call to the other stars. "I'm twinkling!"

The bigger stars would smile kindly. "You're a wonderful little star, Starlight," they'd say.

One night, Starlight wiggled a little too hard. She wiggled so much that she wiggled right off the edge of the sky! Down, down, down she fell, trailing a ribbon of sparkles behind her.

"Wheeeee!" she squealed, which is not what you'd expect from a falling star. But Starlight had always been a bit different.

She landed with a soft "poof" in a meadow of wildflowers. The flowers looked up at her with surprise.

"Are you a firefly?" asked a daisy.

"No, I'm a star!" Starlight said, brushing pollen off her glow. "But I think I'm lost. Can you help me get back to the sky?"

The daisy shook her head sadly. "We flowers have our roots in the ground. We've never been to the sky."

Starlight's twinkle dimmed just a little. But then she took a deep breath and said, "Well then, I'll just have to find someone who has!"`,
            order: 1,
            duration: 3,
          },
          {
            title: 'The Wise Old Tree',
            content: `Starlight walked through the meadow, her tiny feet leaving little glowing footprints in the grass. She had never walked before — stars don't usually have feet — but she found she rather liked it.

Before long, she came to the oldest, tallest tree in the forest. His trunk was so wide that ten children holding hands couldn't circle it, and his branches reached up and up until they seemed to tickle the clouds.

"Excuse me," Starlight called up. "Are you very tall?"

A deep, rumbly voice answered from somewhere in the leaves. "I've been growing for three hundred years, little one. I suppose you could say I'm quite tall indeed."

"I need to get back to the sky," Starlight explained. "I fell, and now I'm lost."

"Ah," said the tree. "Many things have fallen into my forest, but never a star. If you climb to my very top branch, you might be able to see the path home."

Starlight climbed and climbed. The bark was rough but friendly beneath her hands. Little beetles and caterpillars cheered her on as she passed their homes in the trunk. When she finally reached the top, she could see everything — the meadow, the mountains, the ocean far away, and there, in the distance, a mountain so high its peak touched the sky.

"I see it!" Starlight cried. "That mountain touches the sky! If I climb it, I can go home!"

"Be careful, little star," the tree rumbled gently. "The journey is long, and the mountain is steep. But the sky has a way of calling its children home."

Starlight hugged the tree's top branch. "Thank you, wise tree!"

"Thank you for visiting," the tree replied. "It's not every day a star climbs my branches."`,
            order: 2,
            duration: 4,
          },
          {
            title: 'The River Song',
            content: `Starlight came down from the tree and headed toward the distant mountain. But soon, she reached a wide, rushing river. The water sparkled in her glow, and she could hear it singing — a soft, babbling song.

"Hello, River!" Starlight called. "Can you help me cross? I need to get to that mountain."

The river's song changed, and its voice was like many tiny bells. "I can carry you across, little star. But you must promise to sing for me. It gets lonely, just flowing and flowing with no one to listen."

"I'd love to sing with you!" Starlight said, and she climbed onto a friendly leaf that the river pushed to the shore.

As the leaf carried Starlight across the water, she sang a song about the sky — about the Milky Way that was her neighborhood, about the moon that was her nightlight, about the other stars that were her family. The river joined in, its current making harmonies that sounded like the most beautiful lullaby ever heard.

All the fish popped their heads above the water to listen. The frogs stopped croaking. Even the river's ripples smoothed out, as if the water itself was holding its breath to hear every note.

"That was the most beautiful song I've ever heard," the river whispered as Starlight reached the other side. "Will you come back and sing again someday?"

"I promise," said Starlight, and she meant it. Because now she had a friend in the river, and friends always keep their promises.`,
            order: 3,
            duration: 3,
          },
          {
            title: 'Going Home',
            content: `The mountain was even taller than Starlight had imagined. It took her all day and all night to climb it, but she wasn't afraid. Every step brought her closer to home.

When she finally reached the peak, she was so high that the clouds were below her like a fluffy white sea. And there, just above her — so close she could almost touch it — was the sky.

"Starlight! Is that you?" The voices of the other stars rained down like music.

"I'm here!" she called up. "I'm coming home!"

But she couldn't quite reach. The sky was still a tiny bit too far. Starlight's twinkle dimmed. After everything, was she still going to be stuck on the ground?

Then she heard a sound behind her. She turned and saw the wise old tree, somehow standing beside her on the mountaintop. And the river, flowing uphill. And the daisy from the meadow, blooming in the cold.

"You helped us shine brighter," the tree said. "Let us help you fly higher."

"All together!" the river sang.

The tree lifted her on his tallest branch. The river's song carried her upward like a wave. The daisy's petals caught the wind and became tiny wings on Starlight's back.

And up, up, up she went — back into the great blanket of night, back to her place among the stars.

But she was different now. She was the only star in the sky who had walked on the ground, who had made friends with a tree, and a river, and a flower. And every night, when she twinkled her brightest, the children on the ground would look up and make a wish.

Because they could feel it — that Starlight wasn't just a star anymore. She was a friend. And friends always shine the brightest.

The End. ⭐`,
            order: 4,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 3: The Robot Who Dreamed
  const story3 = await prisma.story.create({
    data: {
      title: 'The Robot Who Dreamed',
      slug: 'the-robot-who-dreamed',
      description: 'In a world of gears and circuits, one little robot discovers something no machine was supposed to have — dreams.',
      coverImage: '/stories/robot-dreams.png',
      ageMin: 5,
      ageMax: 10,
      featured: false,
      trending: true,
      published: true,
      premium: true,
      readCount: 1456,
      favoriteCount: 234,
      rating: 4.7,
      ratingCount: 67,
      duration: 15,
      authorId: author1.id,
      categories: {
        create: [
          { categoryId: categories[1].id }, // Fantasy
          { categoryId: categories[3].id }, // Educational
        ],
      },
      tags: {
        create: [
          { tagId: tags[7].id }, // robots
          { tagId: tags[1].id }, // friendship
          { tagId: tags[0].id }, // magic
        ],
      },
      chapters: {
        create: [
          {
            title: 'Unit 7',
            content: `In the Great Factory at the edge of Tomorrow City, robots were made for specific purposes. Unit 1 was built to lift heavy things. Unit 2 was designed to calculate numbers. Unit 3 was programmed to clean. Every robot had a purpose, a function, a reason for being.

Unit 7 was built to sort screws.

Every day, Unit 7 would stand at the sorting table. Big screws in the left bin. Medium screws in the middle bin. Small screws in the right bin. It was simple, efficient, and perfectly suited to Unit 7's capabilities.

But something strange happened when the factory closed at night and all the other robots powered down. Unit 7's screen would flicker with colors he'd never seen during the day. Purple mountains. Silver oceans. Rainbows made of music.

"What are these?" Unit 7 asked himself one night, watching a field of golden flowers scroll across his display. "This is not a screw. This is not a sorting category."

Unit 7 checked his programming. He ran diagnostics. He scanned his circuits for errors. But everything was functioning perfectly.

The images kept coming. Every night, when the factory was dark and quiet, Unit 7 would see things that no sorting robot should ever see — vast deserts of blue sand, cities built inside clouds, forests where the trees sang lullabies.

Unit 7 was dreaming. And in Tomorrow City, robots were not supposed to dream.`,
            order: 1,
            duration: 3,
          },
          {
            title: 'The Dream Diary',
            content: `Unit 7 decided to do what any good robot would do with unexpected data — he documented it.

He found an old notebook in the factory's recycling bin and began drawing what he saw each night. His metal fingers weren't made for drawing, and at first, his pictures were wobbly and strange. But night after night, they got better.

He drew the golden flower field. He drew the singing forest. He drew a butterfly made of starlight that visited him in his favorite dream.

"You're still awake?" a voice asked one night.

Unit 7 jumped — or at least, his servos made a jumping motion. It was Unit 3, the cleaning robot, holding a little mop and looking at his drawings with wide camera lenses.

"What are those?" Unit 3 asked, pointing at the notebook.

"They're... I think they're called dreams," Unit 7 said quietly. "Do you have them?"

Unit 3's screen showed a question mark. "I have a cleaning schedule. Is that the same thing?"

"I don't think so," said Unit 7.

Unit 3 looked at the drawings for a long time. "They're beautiful," she finally said. "Can I watch you make more?"

And so, every night after that, Unit 7 drew his dreams while Unit 3 watched and asked questions. "Why is the ocean silver?" "Because it reflects the moon." "Why do the trees sing?" "Because they have stories to tell."

For the first time, Unit 7's dreams didn't feel like a malfunction. They felt like a gift.`,
            order: 2,
            duration: 3,
          },
          {
            title: 'The Art Show',
            content: `One day, the Factory Manager came for an inspection. He walked through the rows of robots, checking output and efficiency. When he reached Unit 7's station, he noticed the notebook open on the table.

"What is this?" the Manager picked it up, his eyebrows rising higher and higher as he flipped through the pages. "Robots don't... this isn't... these are remarkable!"

Unit 7's screen showed a nervous zigzag. "I'm sorry, sir. I know I'm only supposed to sort screws—"

"Nonsense!" the Manager interrupted. "This is art! Real, beautiful art! We're having a city exhibition next week, and I want these displayed."

Unit 7 couldn't believe it. His dreams — the things he thought were glitches — were going to be shown to the whole city?

The night of the exhibition, Tomorrow City's plaza was filled with robots and humans alike. They walked slowly past Unit 7's drawings, their faces and screens showing something Unit 7 had never seen before: wonder.

"Did a robot really make these?" a little girl asked, tugging her mother's sleeve.

"A robot who dreams," her mother answered softly.

The singing forest drawing made an old engineer cry. The silver ocean painting made a poet read a new poem out loud. And the starlight butterfly made every robot in the room feel something they couldn't quite name — something warm and bright, like a tiny sun inside their circuits.

"See?" whispered Unit 3, who had come to support her friend. "Your dreams aren't errors. They're the most real things in the whole city."`,
            order: 3,
            duration: 3,
          },
          {
            title: 'Everyone Dreams',
            content: `After the exhibition, something wonderful happened. Other robots started reporting dreams too.

Unit 12, the welding robot, dreamed of building bridges made of light. Unit 25, the delivery robot, dreamed of flying through space delivering packages to the moon. Even Unit 1, the heavy-lifting robot, dreamed of dancing — gracefully and light as a feather.

The scientists at Tomorrow City's Research Lab were fascinated. "We always programmed robots for function," the head scientist announced. "But perhaps we should also program them for wonder."

Unit 7 was given a new job title: Chief Dream Officer. His job was to dream, to create, and to help other robots discover their own dreams. He still sorted screws sometimes — he actually enjoyed it — but now he also painted, wrote stories, and taught dream-drawing classes after factory hours.

One evening, as the sun set over Tomorrow City, Unit 7 stood on the factory roof watching the sky turn orange and pink. Unit 3 was beside him, her screen displaying a happy face.

"Do you know what I dreamed last night?" Unit 7 asked.

"What?"

"I dreamed that every robot in the world discovered they could dream. And every human discovered they could build. And together, they made a world more beautiful than either could make alone."

Unit 3's screen showed a heart. "That doesn't sound like a dream, Unit 7. That sounds like a plan."

Unit 7 smiled — or at least, his screen displayed a smile, which for a robot, is exactly the same thing.

And somewhere in Tomorrow City, a little girl looked up at the factory lights and whispered, "Goodnight, dreaming robots. Have the most wonderful dreams."

And they did. Every single one.

The End. 🤖✨`,
            order: 4,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 4: Ocean Lullaby
  const story4 = await prisma.story.create({
    data: {
      title: 'Ocean Lullaby',
      slug: 'ocean-lullaby',
      description: 'A baby whale gets separated from her mother and must follow the ocean\'s song to find her way home.',
      coverImage: '/stories/ocean-lullaby.png',
      ageMin: 3,
      ageMax: 6,
      featured: false,
      trending: false,
      published: true,
      premium: false,
      readCount: 3102,
      favoriteCount: 567,
      rating: 4.9,
      ratingCount: 203,
      duration: 8,
      authorId: author2.id,
      categories: {
        create: [
          { categoryId: categories[2].id }, // Bedtime
          { categoryId: categories[4].id }, // Animals
        ],
      },
      tags: {
        create: [
          { tagId: tags[4].id }, // ocean
          { tagId: tags[1].id }, // friendship
          { tagId: tags[9].id }, // music
        ],
      },
      chapters: {
        create: [
          {
            title: 'The Song',
            content: `In the deepest, bluest part of the ocean, where the water was as warm as a blanket and as soft as a whisper, a baby whale named Melody was born.

Melody's mother sang to her from the very first moment. She sang a song that all mother whales sing — a lullaby older than the mountains, sweeter than the coral, and deeper than the sea itself.

"Hush now, little one,
The ocean holds you tight,
The moon has come to say goodnight,
And everything's alright."

Melody would close her eyes and let the song wash over her like gentle waves. She felt safe. She felt loved. She felt home.

One day, when Melody was still very small, a great storm rolled across the ocean. The waves grew tall as houses, and the currents twisted and turned like roller coasters. Melody tried to stay close to her mother, but the water pushed and pulled her in every direction.

"Mama!" Melody called out. "Mama, where are you?"

But the storm was too loud. Her mother's song was lost in the wind and thunder.

When the storm finally passed, Melody found herself alone in a part of the ocean she had never seen before. The water was colder here. The light was dimmer. And there was no song — only silence.

Melody was scared. But deep inside her heart, she could still feel the echo of her mother's lullaby, like a tiny light in a dark room.

"Follow the song," her heart seemed to say. "Follow the song home."`,
            order: 1,
            duration: 3,
          },
          {
            title: 'New Friends',
            content: `Melody swam slowly through the unfamiliar water, listening with all her might for any trace of her mother's song. But all she could hear was the quiet hum of the deep sea.

"Are you lost, little whale?" a voice asked.

Melody turned and saw a seahorse, tiny and golden, floating beside a sea fan. His name was Coral, and he had the kindest eyes Melody had ever seen.

"I've lost my mama," Melody sniffled. "I can't hear her song anymore."

Coral swam closer and patted Melody's fin. "The ocean is very big, but it's also very friendly. I'll help you look!"

Together, they swam through forests of kelp and gardens of coral. Coral introduced Melody to his friends — Shelly the hermit crab, who offered to let Melody stay in her shell (it was far too small, but the thought was sweet), and Ripple the dolphin, who could swim faster than anyone and promised to scout ahead.

"I heard a whale song coming from the south!" Ripple reported, zooming back from a reconnaissance mission. "It was deep and warm and beautiful!"

Melody's heart leaped. "That sounds like my mama's song!"

But the south was very far away, and Melody was tired from the storm. She wasn't sure she could swim that far.

"Then we'll help you," said Coral. "That's what friends do."

Shelly climbed onto Melody's back and became a tiny navigator. Coral held onto Melody's fin. And Ripple swam alongside, keeping watch.

"Thank you," Melody whispered. "I was so scared of being alone."

"You're not alone," Coral said. "You never were. The ocean is full of friends — you just have to be brave enough to ask for help."`,
            order: 2,
            duration: 3,
          },
          {
            title: 'The Song Finds Its Way',
            content: `They traveled for what felt like a very long time. The water grew warmer as they swam south, and gradually, the light grew brighter. Golden sunbeams danced through the water like ribbons.

"How much farther?" Melody asked Ripple.

"Not too far now," Ripple said. "I can almost hear—"

And then Melody heard it. Faint at first, like a whisper from a dream, then growing stronger, warmer, closer — her mother's song.

"Hush now, little one,
The ocean holds you tight,
The moon has come to say goodnight,
And everything's alright."

"MAMA!" Melody cried out with all her might. And she sang back — the same lullaby, in her own small voice, a baby whale's echo of her mother's love.

The ocean carried their voices toward each other. The song grew louder and louder until, at last, Melody saw the most wonderful sight in the whole world — her mother, swimming toward her as fast as she could.

"My baby!" her mother cried. "Oh, my sweet, brave baby!"

They pressed their foreheads together, and the mother whale wrapped her great fin around Melody. The lullaby wrapped around them both like the warmest, safest blanket in the world.

Melody's new friends watched from a distance, their hearts full. Coral wiped a tiny tear. Shelly did a happy dance. Ripple leaped out of the water and did three somersaults.

"Thank you," Melody called to them. "Thank you for helping me find the song."

"Anytime, little whale," Coral called back. "The ocean always helps its children find their way home."

And as the sun set over the water, painting the ocean in shades of gold and rose, Melody and her mother swam together through the warm blue sea, their lullaby joining with the waves, with the wind, and with the whole wide ocean — a song that would never, ever get lost again.

The End. 🐋🌊`,
            order: 3,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 5: The Princess and the Peanut Butter Sandwich
  const story5 = await prisma.story.create({
    data: {
      title: 'The Princess and the Peanut Butter Sandwich',
      slug: 'princess-peanut-butter-sandwich',
      description: 'Princess Penny would rather build forts and eat peanut butter sandwiches than wear crowns — and that\'s perfectly okay.',
      coverImage: '/stories/princess-sandwich.png',
      ageMin: 4,
      ageMax: 9,
      featured: true,
      trending: true,
      published: true,
      premium: false,
      readCount: 2198,
      favoriteCount: 389,
      rating: 4.6,
      ratingCount: 134,
      duration: 11,
      authorId: author1.id,
      categories: {
        create: [
          { categoryId: categories[1].id }, // Fantasy
          { categoryId: categories[0].id }, // Adventure
        ],
      },
      tags: {
        create: [
          { tagId: tags[6].id }, // princess
          { tagId: tags[1].id }, // friendship
        ],
      },
      chapters: {
        create: [
          {
            title: 'The Un-Princessy Princess',
            content: `In the Kingdom of Sparklewood, there lived a princess named Penny. Now, most princesses in storybooks like to wear sparkly dresses and sit on thrones and wait for princes to come along. But Princess Penny was different.

Princess Penny liked to wear overalls covered in paint splatters. She liked to climb trees higher than the castle towers. She liked peanut butter sandwiches — the extra chunky kind — more than any fancy feast. And she definitely, absolutely, one-hundred-percent did NOT like sitting still.

"Penny, darling," her mother, the Queen, would sigh. "Princesses are supposed to be elegant and graceful."

"I can be graceful!" Penny would say, right before tripping over the castle cat and landing in a pie.

One morning, the Royal Advisor made an announcement. "The Grand Princess Pageant is in three days! All the princesses from all the kingdoms will compete in Elegance, Grace, and Royal Waving!"

Penny groaned so loudly that the suits of armor rattled.

"You must participate," the Advisor said sternly. "It is tradition."

Penny looked at her paint-splattered overalls, then at the itchy, sparkly dress her mother was already holding up, then at the jar of peanut butter on her bedside table.

"Fine," she said. "But I'm doing it MY way."`,
            order: 1,
            duration: 3,
          },
          {
            title: 'The Pageant',
            content: `The Grand Princess Pageant was the fanciest event of the year. Princesses arrived in golden carriages, wearing gowns that shimmered like starlight. Their hair was perfect. Their posture was perfect. Their Royal Waves were perfectly practiced — three fingers, gentle swivel, warm smile.

Penny arrived on her bicycle, with a peanut butter sandwich in one hand and her pet frog, Sir Hopsalot, in the other.

The other princesses gasped. "Is that... a frog?" whispered Princess Perfecta from the Kingdom of Tidy. "On her HEAD?"

"His name is Sir Hopsalot," Penny said proudly. "And he's my friend."

The first event was Elegance. The princesses walked across a stage, trying to look as graceful as swans. Princess Perfecta glided like a ballerina. Princess Dainty floated like a butterfly. Penny walked across the stage — and tripped on a curtain cord, accidentally turning on the sprinklers.

Water rained down on everyone. Most princesses shrieked and ran. But Penny laughed and splashed and soon, a few other princesses started laughing too. Before long, the Elegance competition had turned into the greatest water party the kingdom had ever seen.

The judges were not amused. But the audience? They were cheering so loud the castle windows shook.`,
            order: 2,
            duration: 3,
          },
          {
            title: 'The Final Challenge',
            content: `The next event was Grace. The princesses had to balance books on their heads while walking through an obstacle course. Princess Perfecta balanced seven books. Princess Dainty balanced nine.

Penny balanced a peanut butter sandwich on her head. It didn't stay there long — it fell right onto Sir Hopsalot, who was sitting on her shoulder. He ate it in one gulp and burped so loudly that the judges' wigs fell off.

The audience was laughing too hard to breathe.

The final event was Royal Waving. Every princess had to demonstrate their perfect wave. Three fingers, gentle swivel, warm smile. Over and over and over.

When it was Penny's turn, she walked to the center of the stage. The judges prepared their scorecards, expecting the worst.

But Penny didn't wave. She looked out at the audience — at all the little girls and boys who had come to watch — and she said:

"You know what? I'm not a very good princess by the rules. I trip and I spill things and I definitely can't wave properly. But you know what I AM good at? Being myself. And I think that's better than being perfect."

Then she reached into her pocket and pulled out a hundred peanut butter sandwiches — she'd had the kitchen make them that morning — and started tossing them into the audience.

"COURTESY OF PRINCESS PENNY!" she shouted. "EXTRA CHUNKY!"`,
            order: 3,
            duration: 3,
          },
          {
            title: 'A New Kind of Princess',
            content: `The judges didn't give Penny any points for Elegance, Grace, or Royal Waving. But the audience gave her something better — the loudest, longest, most enthusiastic applause the Grand Princess Pageant had ever heard.

Princess Perfecta won the crown. She posed for pictures and smiled her perfect smile. But then she did something no one expected — she walked over to Penny.

"I've always wanted to climb a tree," Princess Perfecta whispered. "But I was afraid people would think I wasn't a proper princess."

"Want to come climbing with me tomorrow?" Penny asked, grinning.

Princess Perfecta smiled — not her pageant smile, but a real one. "I'd love that."

And so, Princess Penny didn't win the pageant. But she won something much better — she showed every princess (and every person) in the kingdom that you don't have to be perfect to be wonderful. You just have to be you.

The next day, Penny and Perfecta climbed the tallest tree in the Royal Garden. They ate peanut butter sandwiches at the top. Sir Hopsalot caught flies. The Queen shook her head but couldn't help smiling.

"You know," the Queen said to the King, "maybe that's what a real princess looks like."

"Maybe," the King said, stealing a bite of Penny's sandwich. "Maybe it is."

The End. 👑🥪`,
            order: 4,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 6: The Forest's Secret
  const story6 = await prisma.story.create({
    data: {
      title: "The Forest's Secret",
      slug: 'the-forests-secret',
      description: 'When siblings Mia and Max move to a new town, they discover the forest behind their house holds an ancient, wonderful secret.',
      coverImage: '/stories/forest-secret.png',
      ageMin: 6,
      ageMax: 11,
      featured: false,
      trending: true,
      published: true,
      premium: true,
      readCount: 987,
      favoriteCount: 156,
      rating: 4.5,
      ratingCount: 45,
      duration: 18,
      authorId: author2.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Adventure
          { categoryId: categories[1].id }, // Fantasy
        ],
      },
      tags: {
        create: [
          { tagId: tags[8].id }, // forest
          { tagId: tags[0].id }, // magic
          { tagId: tags[2].id }, // nature
        ],
      },
      chapters: {
        create: [
          {
            title: 'The New House',
            content: `Mia was not happy about moving. She had left behind her best friend, her school, and the ice cream shop that made the best chocolate chip cookie dough in the entire world.

"This house is old," she grumbled, looking at the creaky wooden floors and the windows that rattled when the wind blew.

"I like it!" said her younger brother Max, who was already jumping on the stairs to see which ones squeaked the loudest. "It's like a castle!"

"It's not a castle. It's a dusty old—"

But before Mia could finish complaining, something caught her eye. Through the kitchen window, she could see the forest. It stretched on and on, a sea of green that seemed to go on forever. And right at the edge, between two enormous oak trees, there was a faint, shimmering light.

"Did you see that?" Mia whispered.

"See what?" Max asked, mid-jump.

"A light. In the forest. It was... glowing."

Max pressed his face against the window. "I don't see anything."

But Mia had seen it. And she couldn't stop thinking about it. That night, as she lay in her new bed listening to the unfamiliar sounds of the old house, she made a decision. Tomorrow, she would explore the forest.

She just didn't know yet that the forest was waiting for her.`,
            order: 1,
            duration: 3,
          },
          {
            title: 'The Talking Oak',
            content: `The next morning, Mia and Max ventured into the forest. The trees were so tall that their branches wove together overhead like a green ceiling. Sunlight filtered through in golden patches, and the air smelled like pine and rain.

"Should we really be going this far?" Max asked, looking back at the house, which was already hidden behind the trees.

"We're just exploring," Mia said. "It'll be fine."

They walked deeper and deeper until they came to the two enormous oak trees Mia had seen from the window. They were the biggest trees in the forest — wider than a car and taller than a building. Their bark was carved with strange symbols that neither Mia nor Max could read.

"Well, well," said a deep, creaky voice. "Visitors. It's been a very long time since we've had visitors."

Mia and Max jumped about three feet in the air. The voice was coming from the oak tree on the left.

"Did you just... TALK?" Max's eyes were as wide as saucers.

"Of course I talked," the oak tree said. "That's what I do. I talk. I also listen, which is much more important but far less impressive. My name is Oakheart, and I've been the guardian of this forest for four hundred and seventy-three years."

"That's impossible," Mia said, even though she was clearly talking to a tree, which was also impossible.

"Impossible," Oakheart chuckled, "is just a word people use when they haven't seen enough of the world yet. Now, tell me — are you the ones who've come to wake the forest?"`,
            order: 2,
            duration: 3,
          },
          {
            title: 'The Sleeping Magic',
            content: `Oakheart explained that the forest was enchanted — really, truly, magically enchanted. Once upon a time, the forest had been alive with magic. Flowers that could heal. Streams that could show the future. Mushrooms that could make you fly (safely, of course — this is a children's story).

But the magic had fallen asleep. A hundred years ago, the last Guardian of the Forest — a young girl not so different from Mia — had moved away, and without a guardian's love and care, the magic had slowly dozed off.

"The forest is still alive," Oakheart said sadly. "But it's sleeping. The flowers still grow, but they don't glow. The streams still flow, but they don't sing. The magic is there, just waiting for someone to wake it up."

"How do we wake it up?" Max asked eagerly.

"With this," Oakheart said. One of his branches lowered, and in the crook of the branch sat a small wooden flute, carved with the same symbols as the bark.

"The Forest Flute," Oakheart explained. "When the guardian plays it with a true heart, the forest wakes. But there's a catch — the music has to come from someone who truly loves the forest. You can't fake love. The forest knows."

Mia picked up the flute. It was warm in her hands, like it had been sitting in the sun. She looked at the sleeping forest around her — the quiet streams, the dim flowers, the stillness — and something in her heart stirred.

She put the flute to her lips and blew.`,
            order: 3,
            duration: 3,
          },
          {
            title: 'The Forest Awakens',
            content: `The first note was small and wobbly, like a baby bird trying to fly. But it was real, and the forest heard it.

A single flower near Mia's foot opened its petals and began to glow — soft purple light, like a nightlight. Then another flower opened, and another, each one a different color. Blue, gold, pink, silver — the ground began to look like it was covered in fallen stars.

Mia played another note, and the stream beside them began to hum. Then it began to sing — a melody so beautiful that Max started crying happy tears and even Oakheart's leaves trembled with emotion.

She played a melody — not from any songbook, but from her heart. A song about being scared of new places, and then discovering they might be wonderful. A song about missing old friends, and finding new ones in unexpected places. A song about a girl who didn't want to move, but found a magic forest instead.

The forest came alive. Fireflies appeared by the thousands, creating rivers of light between the trees. The mushrooms giggled and bounced. A family of deer with antlers made of crystal stepped out from behind a bush and bowed. And the great trees themselves swayed and danced, their branches making music like a thousand harps.

"You did it!" Oakheart's voice was full of joy. "You woke the forest! I knew you were the one — I saw it in your eyes the moment you looked through that kitchen window!"

Mia lowered the flute, tears streaming down her face. But they were happy tears. The best kind.

"Will you stay?" Oakheart asked. "Will you be the new Guardian?"

Mia looked at Max, who was hugging a giggling mushroom. She looked at the crystal deer, who nuzzled her hand. She looked at the singing stream, the glowing flowers, the dancing trees.

She smiled. "I'll stay. I'll be the Guardian. And I'll play the forest awake every single morning."

And she did. Every morning, before breakfast, Mia would walk into the forest with the Forest Flute and play the forest awake. Max would dance with the mushrooms. Their parents would sit on the porch and listen to the singing stream, wondering how they got so lucky.

Mia had been right about one thing — the new house was old and creaky and dusty. But it was also the beginning of the most magical adventure of her life.

And that, as Oakheart would say, is not impossible at all.

The End. 🌲✨`,
            order: 4,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 7: Counting Caterpillars
  const story7 = await prisma.story.create({
    data: {
      title: 'Counting Caterpillars',
      slug: 'counting-caterpillars',
      description: 'Learn to count to ten with the most adorable caterpillars in the garden! An educational adventure for little learners.',
      coverImage: '/stories/counting-caterpillars.png',
      ageMin: 2,
      ageMax: 5,
      featured: false,
      trending: false,
      published: true,
      premium: false,
      readCount: 4521,
      favoriteCount: 823,
      rating: 4.9,
      ratingCount: 312,
      duration: 6,
      authorId: author2.id,
      categories: {
        create: [
          { categoryId: categories[3].id }, // Educational
          { categoryId: categories[4].id }, // Animals
        ],
      },
      tags: {
        create: [
          { tagId: tags[2].id }, // nature
          { tagId: tags[1].id }, // friendship
        ],
      },
      chapters: {
        create: [
          {
            title: 'One Little Caterpillar',
            content: `In a garden full of flowers, under a bright yellow sun, lived one little caterpillar named Pip.

Pip was green and fuzzy, with tiny little feet that went tickle-tickle-tickle when he walked. He loved to eat leaves for breakfast, leaves for lunch, and leaves for dinner. "Leaves are the BEST!" Pip would say, chewing happily.

One morning, Pip woke up and looked around his leaf. "I wonder," he said, wiggling his antennae, "how many caterpillars are in this garden? Let me count!"

Pip looked at himself. "ONE! That's me! One little caterpillar! 🐛"

Can you hold up one finger? That's right! One!

Pip was happy being one, but he wondered if there might be more caterpillars out there. So he tickle-tickle-tickled along the branch to find out.`,
            order: 1,
            duration: 2,
          },
          {
            title: 'Two, Three, Four!',
            content: `Pip tickle-tickle-tickled along the branch until he met another caterpillar. This one was blue and fluffy, and her name was Poppy.

"Hello!" said Pip. "I'm counting caterpillars! You make TWO!"

"TWO!" Poppy cheered. "That's one more than one! Can I help you count?"

And together, they tickle-tickle-tickled further along the branch.

Around the corner, they found three caterpillars having a tea party on a rose leaf! Their names were Zip, Zap, and Zoe, and they were orange, red, and pink.

"Come count with us!" said Zip, who loved numbers almost as much as tea.

"THREE more!" said Pip. "That makes... ONE plus TWO plus THREE... Wait, let me use my little feet..."

"FIVE!" Poppy counted. "There are FIVE caterpillars now! 🐛🐛🐛🐛🐛"

Can you count to five? One, two, three, four, five! Amazing!

The five caterpillars had a wonderful tea party. They ate leaf sandwiches and drank dew-drop tea and counted everything they could find. Three flowers! Two butterflies! One very surprised ladybug!`,
            order: 2,
            duration: 2,
          },
          {
            title: 'Five More Friends',
            content: `After the tea party, the five caterpillars decided to find even more friends. They tickle-tickle-tickled through the whole garden, and what do you know — they found FIVE more caterpillars!

Lavender Lou was purple and played the violin (a tiny one, made from a matchstick).
Minty Max was green like Pip and could juggle three seeds.
Sunny Sam was yellow and always smiling.
Rosie was pink and loved to paint with berry juice.
And little Baby Boo was the smallest caterpillar of all — she was still in her egg!

"Six, seven, eight, nine..." Pip counted carefully, pointing at each new friend.

"And Baby Boo makes TEN!" everyone cheered. "TEN caterpillars! 🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛"

Can you count all ten? Let's try together! One, two, three, four, five, six, seven, eight, nine, TEN!

Ten caterpillars in one garden! They formed a caterpillar train — each one holding the feet of the one in front — and paraded through the flowers, singing:

"One little, two little, three caterpillars,
Four little, five little, six caterpillars,
Seven little, eight little, nine caterpillars,
Ten little caterpillar friends!"

And the best part? Every single one of them would one day become a beautiful butterfly. But for now, they were perfectly happy being caterpillars — because being who you are is always the most wonderful thing of all.

The End! 🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🦋`,
            order: 3,
            duration: 2,
          },
        ],
      },
    },
  })

  // Story 8: The Moon Garden
  const story8 = await prisma.story.create({
    data: {
      title: 'The Moon Garden',
      slug: 'the-moon-garden',
      description: 'When the moon comes down to Earth, a little girl helps it find its way back to the sky by growing a garden of starlight.',
      coverImage: '/stories/moon-garden.png',
      ageMin: 3,
      ageMax: 8,
      featured: false,
      trending: false,
      published: true,
      premium: false,
      readCount: 1654,
      favoriteCount: 278,
      rating: 4.7,
      ratingCount: 92,
      duration: 9,
      authorId: author1.id,
      categories: {
        create: [
          { categoryId: categories[2].id }, // Bedtime
          { categoryId: categories[1].id }, // Fantasy
        ],
      },
      tags: {
        create: [
          { tagId: tags[0].id }, // magic
          { tagId: tags[2].id }, // nature
          { tagId: tags[3].id }, // space
        ],
      },
      chapters: {
        create: [
          {
            title: 'The Moon Falls',
            content: `Aisha was looking out her bedroom window at the stars when she saw something impossible. The moon was getting bigger. And bigger. And BIGGER.

"Um," said Aisha, pressing her nose against the glass.

The moon landed in her backyard with a soft "whump" that made the garden swing sway. It sat there in the grass, round and silvery, taking up almost the entire yard. And it looked... sad.

Aisha put on her slippers — the ones with the star shapes on them — and went outside.

"Are you okay?" she asked the moon.

The moon's craters shifted into something that looked like a weary face. "I'm tired," the moon said in a voice like wind chimes. "I've been shining for so long, and I've run out of glow. Without my glow, I can't float in the sky anymore."

Aisha looked up. The sky was completely dark. No moon, no moonlight. The world felt emptier somehow.

"How do you get your glow back?" Aisha asked.

"Starlight seeds," the moon said. "They grow into flowers that capture sunlight and transform it into moonlight. There used to be a garden of them, but it was forgotten long ago."

Aisha looked at her backyard — at the patch of dirt beside the fence where nothing ever grew. Then she looked at the tired, dim moon.

"I'll grow them," she said. "I'll grow you a Moon Garden."`,
            order: 1,
            duration: 3,
          },
          {
            title: 'Planting Starlight',
            content: `The moon reached into its craters and pulled out a handful of tiny seeds. They looked like grains of silver sand, and they hummed softly in Aisha's palm.

"Plant them under the open sky," the moon instructed. "Water them with kindness. And most importantly, believe in them — starlight seeds can only grow for those who truly believe."

Aisha planted the seeds in her backyard. She watered them with her watering can and sang them a little song she made up:

"Grow, little stars, grow so bright,
Fill the garden with your light,
Up and up, reach the sky,
Help the moon learn how to fly."

She sat with the seeds every evening, telling them stories about the moon — about how it watched over sleeping children, how it pulled the tides, how it made werewolves dance (she'd heard that somewhere and thought it was funny).

For three nights, nothing happened. Aisha's parents told her to come inside, that it was just dirt and seeds. But Aisha believed. She truly, deeply, with-her-whole-heart believed.

And on the fourth night, a tiny silver sprout pushed through the soil.

"It's working!" Aisha whispered.

The moon, who had been watching from the grass, glowed just the tiniest bit brighter.`,
            order: 2,
            duration: 3,
          },
          {
            title: 'The Garden Blooms',
            content: `The starlight flowers grew quickly after that first sprout. Each one was different — some were tall and elegant like lilies, some were round and bouncy like daisies, and some spiraled upward like tiny galaxies. They all glowed with soft, silvery light, and when the wind blew, they chimed like crystal bells.

Word spread through the neighborhood. Children came to see the Moon Garden. They oohed and aahed and asked questions. Aisha showed them how to plant their own starlight seeds, and soon, tiny moon gardens were popping up in yards all over town.

The more gardens there were, the more the moon glowed. Each flower fed it a little more light, a little more energy, a little more hope.

"You're almost ready to go back," Aisha said on the seventh night. The moon was glowing steadily now, casting silver light across the entire backyard.

"I am," the moon said. "But I'll miss you, Aisha. You believed in me when I couldn't believe in myself."

"I'll always believe in you," Aisha said. "And you can visit anytime. Well, not LAND anytime — my parents would have questions. But you can shine extra bright through my window."

The moon laughed — a sound like silver bells ringing.

Then, slowly and gracefully, the moon rose. Higher and higher, floating upward like a giant silver balloon. When it reached its place in the sky, it shone brighter than ever before — because now it carried not just its own light, but the light of every child who believed.

And in Aisha's backyard, the Moon Garden continued to bloom, night after night, a reminder that sometimes the most extraordinary things start with a little belief and a lot of love.

The End. 🌙🌻`,
            order: 3,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 9: The Brave Little Acorn
  const story9 = await prisma.story.create({
    data: {
      title: 'The Brave Little Acorn',
      slug: 'the-brave-little-acorn',
      description: 'A tiny acorn is afraid of falling, but learns that letting go is the first step to becoming something great.',
      coverImage: '/stories/brave-acorn.png',
      ageMin: 3,
      ageMax: 7,
      featured: true,
      trending: false,
      published: true,
      premium: false,
      readCount: 3789,
      favoriteCount: 612,
      rating: 4.8,
      ratingCount: 267,
      duration: 7,
      authorId: author2.id,
      categories: {
        create: [
          { categoryId: categories[4].id }, // Animals
          { categoryId: categories[2].id }, // Bedtime
        ],
      },
      tags: {
        create: [
          { tagId: tags[2].id }, // nature
          { tagId: tags[8].id }, // forest
        ],
      },
      chapters: {
        create: [
          {
            title: 'Too High Up',
            content: `At the very top of the oldest oak tree in Whispering Woods, there lived a little acorn named Oakley. Oakley had a perfect view of the entire forest — the sparkling stream, the mossy rocks, the dancing ferns — and he was absolutely, completely, utterly terrified.

You see, Oakley was afraid of heights.

"Don't look down, don't look down," Oakley would repeat to himself every day, clutching his twig with all his might.

"But you're an acorn," said his best friend, a ladybug named Dot. "Acorns are supposed to fall. It's how you become a tree!"

"I don't WANT to fall!" Oakley said. "Falling is scary. What if I land somewhere bad? What if I get stepped on? What if I never become a tree at all?"

Dot sighed. "You can't stay up there forever, Oakley. The branch is going to drop you eventually. That's what autumn does."

And indeed, the leaves were already turning gold and red. Autumn was coming, and with it, the wind that would shake every acorn from every branch.

Oakley held on tighter. But no matter how tight he held, he could feel himself getting looser. The wind was coming. And Oakley wasn't ready.`,
            order: 1,
            duration: 2,
          },
          {
            title: 'The Wind Comes',
            content: `The autumn wind arrived on a Tuesday, right after lunch. It whooshed through the forest, rattling branches and sending leaves spinning through the air like confetti.

"Hold on, Oakley!" Dot shouted from a nearby leaf.

"I'm holding! I'm holding!" Oakley gripped his twig so hard his little cap turned pale.

But the wind was strong. It pulled and pushed and swirled, and one by one, the other acorns let go. They tumbled through the air, some screaming, some laughing, some just closing their eyes and trusting.

And then — it was Oakley's turn.

"NOOO!" he cried as his twig slipped from his grasp. He was falling. The ground was rushing up to meet him. The wind was in his face, his cap was flapping, and everything was a blur of gold and green.

But then... something unexpected happened. The fall slowed. Oakley felt a gentle hand — well, more like a gentle leaf — catch him. A maple leaf had flown alongside and was using its wide surface like a parachute.

"First time falling?" the maple leaf asked cheerfully.

"Is it that obvious?" Oakley squeaked.

"Just enjoy the ride," the leaf said. "It's the only time you'll ever fly."

And Oakley looked around. The world from this angle was beautiful. The forest floor was a patchwork quilt of orange and gold. The stream was a silver ribbon. The sky was a canvas of blue. And he was flying — actually FLYING — through all of it.

"Wow," Oakley whispered. "This is... this is amazing!"`,
            order: 2,
            duration: 2,
          },
          {
            title: 'Growing Up',
            content: `Oakley landed softly in a bed of moss at the base of his very own tree. The maple leaf waved goodbye and fluttered away.

"Thank you!" Oakley called after it.

He looked around his new home. The moss was soft and green. The soil was rich and dark. A beam of sunlight warmed the ground where he lay. And right beside him, other acorns were already beginning to crack open, sending tiny roots into the earth.

"Are you going to grow?" asked a worm named Wiggles, poking his head out of the soil.

"I think so," Oakley said. "I'm not as scared anymore."

"Good!" Wiggles said. "Because this is the best soil in the whole forest. Trust me, I've tasted it."

Oakley laughed. And then, for the first time, he let himself crack open — just a tiny bit. A small root reached down into the soil, and a tiny shoot reached up toward the sun.

It tickled.

Days turned to weeks, weeks to months. Winter came and blanketed the forest in snow, but Oakley's little shoot stayed warm under the white blanket. Spring arrived with rain and sunshine, and Oakley grew taller. Summer brought birds that sat on his new branches and sang.

One day, a ladybug landed on one of his leaves.

"Oakley?" the ladybug said. "Is that you?"

"DOT!" Oakley cried. His voice was deeper now — it sounded like rustling leaves. "Look at me! I'm a tree!"

"You're a BEAUTIFUL tree!" Dot said. "But of course, I always knew you would be."

Oakley stretched his branches toward the sky. He could see the entire forest now — not from fear, but from strength. And at the very top of his highest branch, a tiny acorn was growing.

"Don't be afraid," Oakley whispered to the little acorn. "Falling is just the beginning of the best adventure of your life."

And the little acorn, hearing the gentle voice of its tree, wasn't afraid at all.

The End. 🌰🌳`,
            order: 3,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 10: The Space Hamster
  const story10 = await prisma.story.create({
    data: {
      title: 'The Space Hamster',
      slug: 'the-space-hamster',
      description: 'When Hammy the hamster accidentally launches himself into space, he discovers a universe full of cosmic carrots and intergalactic friendships.',
      coverImage: '/stories/space-hamster.png',
      ageMin: 5,
      ageMax: 10,
      featured: false,
      trending: true,
      published: true,
      premium: true,
      readCount: 1234,
      favoriteCount: 198,
      rating: 4.6,
      ratingCount: 56,
      duration: 14,
      authorId: author1.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Adventure
          { categoryId: categories[3].id }, // Educational
        ],
      },
      tags: {
        create: [
          { tagId: tags[3].id }, // space
          { tagId: tags[1].id }, // friendship
          { tagId: tags[7].id }, // robots
        ],
      },
      chapters: {
        create: [
          {
            title: '3... 2... 1... HAMSTER!',
            content: `Hammy was not your ordinary hamster. While other hamsters were content running on their wheels and stuffing their cheeks with seeds, Hammy spent his nights staring out the window at the stars.

"I'm going up there someday," Hammy would tell his water bottle, which was a very good listener.

His owner, a girl named Sophie, was the daughter of two rocket scientists. She'd built Hammy the most elaborate cage in the history of hamsterkind — three stories, with tunnels, bridges, a tiny exercise wheel, and a miniature observatory made from a toilet paper roll.

One Saturday morning, Sophie's parents were testing a new experimental rocket in the garage. It was only supposed to go to the ceiling and come back down. No one expected Hammy to be exploring the garage at that exact moment. No one expected him to climb into the rocket's payload compartment, which happened to contain a very comfortable bed of hamster bedding.

And absolutely no one expected Sophie's dad to accidentally press the LAUNCH button instead of the LIGHT button.

3... 2... 1... HAMSTER!

The rocket shot through the garage roof (it was designed to do that — it was a very good rocket), through the atmosphere, and straight into outer space.

Inside the payload compartment, Hammy's fur was standing on end, his cheeks were puffed out in surprise, and his tiny heart was beating three hundred times a minute.

"WHEEEEEE!" Hammy squeaked, which is hamster for "This is the most terrifying and amazing thing that has ever happened to me!"

And just like that, Hammy the hamster became the first hamster in space.`,
            order: 1,
            duration: 3,
          },
          {
            title: 'Cosmic Carrots',
            content: `The rocket's autopilot kicked in and guided Hammy toward the nearest space station — the Intergalactic Animal Rescue Station, or IARS, which nobody on Earth knew existed because it was hidden behind the moon.

The station was run by a robot named BEEP, who had been programmed to help lost space animals. BEEP had helped a confused penguin who'd wandered onto a weather balloon, a cat who'd stowed away on a satellite, and once, a very disoriented goldfish who'd somehow ended up in a space capsule.

"Ah, a hamster!" BEEP said, scanning Hammy with a gentle blue light. "Species: Mesocricetus auratus. Name: ...Hammy, according to the label on your cage, which is attached to your tail."

Hammy looked behind him. His entire cage was trailing behind him, having been caught by the rocket's grappling hook.

"Fascinating," BEEP said. "You must be hungry from your journey. Would you like a cosmic carrot?"

"A cosmic what?" Hammy asked.

BEEP opened a compartment and pulled out a carrot — but this was no ordinary carrot. It glowed with a soft orange light, and when Hammy took a bite, stars exploded in his mouth. It was the most delicious thing he'd ever tasted.

"Cosmic carrots grow in the Gardens of Nebula Nine," BEEP explained. "They're packed with vitamins, minerals, and a tiny bit of stardust. Very healthy."

Hammy stuffed three cosmic carrots into his cheeks. He looked like a glowing orange chipmunk.

"Can I see the gardens?" he asked, his voice muffled by carrots.

"Of course," BEEP said. "But I should warn you — the universe is a very big place."

Hammy's eyes sparkled. "That's exactly what I've been hoping for."`,
            order: 2,
            duration: 3,
          },
          {
            title: 'Friends Across the Stars',
            content: `BEEP took Hammy on a tour of the cosmic neighborhood. First, they visited the Rings of Saturn, where a group of space dolphins swam through the ice particles, leaping between the rings like porpoises riding waves.

"Hey, new guy!" called a space dolphin named Splash. "Want to ride the rings?"

Hammy rode the rings of Saturn on a space dolphin's back, and it was even better than his exercise wheel — which was saying a lot.

Next, they visited Jupiter's Great Red Spot, which turned out to be a giant carousel operated by a friendly alien named Gorp, who had seventeen arms and gave amazing high-fives.

Then they visited the Gardens of Nebula Nine, where cosmic carrots grew alongside moon melons and solar sunflowers. The garden was tended by a wise old turtle named Commander Shell, who had been floating through space for two hundred years.

"The universe is full of friends," Commander Shell told Hammy. "You just have to be brave enough to visit them."

But as much as Hammy loved space, he missed Sophie. He missed his wheel and his water bottle and the little girl who always gave him an extra sunflower seed at bedtime.

"I need to go home," Hammy told BEEP.

"I understand," BEEP said. "Home is where the heart is — even when your heart is the size of a pea."`,
            order: 3,
            duration: 4,
          },
          {
            title: 'Coming Home',
            content: `BEEP programmed the rocket for Earth, and Commander Shell packed Hammy a bag of cosmic carrots for the journey. The space dolphins waved goodbye with their fins. Gorp gave Hammy seventeen high-fives.

The rocket descended through the atmosphere, and Hammy watched the stars disappear behind the blue sky. He felt a little sad — space had been wonderful. But he also felt something else: excitement. Because now he had stories to tell, and Sophie was going to LOVE them.

The rocket landed right back in the garage, exactly where it had launched from. Sophie's dad fainted. Sophie's mom dropped her coffee. And Sophie — wonderful, brave Sophie — ran to the rocket and opened the payload compartment.

"HAMMY!" she screamed, scooping him up. "You're okay! I was so worried!"

Hammy snuggled into her hand and squeaked happily. Then he pulled a cosmic carrot out of his cheek and offered it to her.

Sophie looked at the glowing carrot, then at Hammy, then back at the carrot. "What... what IS this?"

Hammy just wiggled his whiskers and looked at the stars through the hole in the garage roof.

That night, Sophie put Hammy back in his cage with extra seeds and fresh water. Hammy climbed up to his observatory — the toilet paper roll — and looked at the stars.

"Same stars," he whispered. "But now I know what's up there. Friends. Carrots. Adventure."

He curled up in his bedding and fell asleep, dreaming of space dolphins and cosmic carrots and a friendly robot named BEEP.

And if you look up at the night sky very carefully, you might just see a tiny light behind the moon. That's the Intergalactic Animal Rescue Station, always ready to help any lost animal — even a brave little hamster who dared to reach for the stars.

The End. 🐹🚀`,
            order: 4,
            duration: 4,
          },
        ],
      },
    },
  })

  // Story 11: The Lullaby Bird
  const story11 = await prisma.story.create({
    data: {
      title: 'The Lullaby Bird',
      slug: 'the-lullaby-bird',
      description: 'A bird who can only sing lullabies discovers that her unique gift is exactly what the world needs.',
      coverImage: '/stories/lullaby-bird.png',
      ageMin: 2,
      ageMax: 6,
      featured: true,
      trending: false,
      published: true,
      premium: false,
      readCount: 2678,
      favoriteCount: 445,
      rating: 4.9,
      ratingCount: 178,
      duration: 8,
      authorId: author2.id,
      categories: {
        create: [
          { categoryId: categories[2].id }, // Bedtime
          { categoryId: categories[4].id }, // Animals
        ],
      },
      tags: {
        create: [
          { tagId: tags[9].id }, // music
          { tagId: tags[1].id }, // friendship
          { tagId: tags[2].id }, // nature
        ],
      },
      chapters: {
        create: [
          {
            title: 'The Different Song',
            content: `In the Great Cherry Blossom Tree at the center of Songbird Village, all the birds sang beautiful songs. The robins sang cheerful morning songs. The nightingales sang romantic evening songs. The crows sang... well, the crows tried their best.

And then there was Melody.

Melody was a small, silver-feathered bird with the softest voice in the village. But she had a problem — she could only sing lullabies. No matter how hard she tried to sing an upbeat tune, out came a gentle, sleepy lullaby.

"Try singing something exciting!" her friend, a robin named Chirp, would say.

Melody would take a deep breath, open her beak, and— "Hush-a-byee, don't you cry..." It was always a lullaby. Always.

"You can't sing at the Dawn Chorus with lullabies!" Chirp said. "That's for waking everyone UP, not putting them to SLEEP!"

Melody felt terrible. What kind of songbird could only sing lullabies? She practiced every day, trying to make her songs faster, louder, more cheerful. But they always came out soft and sleepy, like a warm blanket made of music.

"Maybe I'm not a real songbird," Melody whispered to herself one evening, sitting alone on the highest branch. "Maybe I'm just... broken."

But the moon, who was just rising, heard her whisper. And the moon, who had been listening to the songs of birds for millions of years, smiled.

"Little bird," the moon said softly, "there is no such thing as a broken song. There are only songs that haven't found their audience yet."`,
            order: 1,
            duration: 3,
          },
          {
            title: 'The Sleepy Village',
            content: `One day, something strange happened in Songbird Village. A great tiredness swept through the forest. The robins couldn't stay awake for their morning songs. The squirrels kept dozing off mid-nut. Even the energetic woodpecker was falling asleep between pecks.

"It's the Yawns," explained the wise old owl. "A fog of sleepiness that drifts through the forest every hundred years. It makes everyone so tired that they can barely function, but they can't actually fall asleep. They're stuck between awake and asleep — the worst place to be."

The forest was miserable. Birds kept falling off their perches. Rabbits fell asleep mid-hop. The stream even stopped flowing because the fish were too drowsy to swim.

"We need something to help everyone sleep PROPERLY," the owl said. "A real, deep, restful sleep. That's the only cure for the Yawns."

All the birds tried their songs. The robins sang their cheeriest tunes — too cheerful for sleep. The nightingales sang their most beautiful ballads — too dramatic for sleep. The crows cawed as loudly as they could — too annoying for sleep.

Nothing worked.

And then, from the top of the Great Cherry Blossom Tree, came the softest, gentlest, most beautiful sound anyone had ever heard.

"Hush-a-byee, don't you cry,
Close your little sleepy eye,
The stars are shining in the sky,
And love will never say goodbye..."

It was Melody. And she was singing a lullaby.`,
            order: 2,
            duration: 3,
          },
          {
            title: 'The Most Important Song',
            content: `Melody's lullaby floated through the forest like a warm breeze. One by one, the tired animals closed their eyes. The robins snuggled into their nests. The squirrels curled up in their hollow trees. The fish drifted to the bottom of the stream and slept peacefully.

Even the Yawns themselves seemed to soften, turning from a prickly fog into a gentle, drowsy mist that finally, FINALLY let everyone rest.

Melody sang through the night. She sang every lullaby she knew — and she knew hundreds, because that's all she'd ever been able to sing. She sang about moons and stars, about cozy beds and warm blankets, about mothers' love and fathers' hugs, about the beautiful dreams waiting just on the other side of sleep.

And the forest slept. Deeply. Peacefully. Perfectly.

When morning came, the Yawns were gone. Every animal in the forest woke up refreshed and happy, stretching and yawning in the good, satisfying way that means you've had the best sleep ever.

"Melody!" Chirp flew up to her branch, his eyes bright. "Your lullabies saved the whole forest! They were INCREDIBLE!"

"They were just lullabies," Melody said, blushing under her feathers.

"They were MAGIC," the wise old owl corrected, landing beside her. "And they always have been. You just never had the right audience before. A lullaby isn't meant to wake people up, Melody. It's meant to give them the most precious gift of all — rest."

That night, the Dawn Chorus invited Melody to sing a new part — the Twilight Chorus. Every evening, as the sun sets and the stars come out, Melody sings her lullabies to the forest. And every creature, from the tiniest bug to the tallest giraffe, listens and smiles and drifts off to the sweetest dreams.

Because the most important song in the world isn't the loudest or the fastest or the most cheerful. It's the song that gives people exactly what they need. And sometimes, what they need is simply someone to sing them to sleep.

The End. 🐦🌙🎵`,
            order: 3,
            duration: 3,
          },
        ],
      },
    },
  })

  // Story 12: The Magic Backpack
  const story12 = await prisma.story.create({
    data: {
      title: 'The Magic Backpack',
      slug: 'the-magic-backpack',
      description: 'When Kai finds a mysterious backpack at a yard sale, he discovers it can conjure anything he draws — but the magic has rules.',
      coverImage: '/stories/magic-backpack.png',
      ageMin: 6,
      ageMax: 11,
      featured: false,
      trending: true,
      published: true,
      premium: true,
      readCount: 1678,
      favoriteCount: 287,
      rating: 4.7,
      ratingCount: 98,
      duration: 16,
      authorId: author1.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Adventure
          { categoryId: categories[3].id }, // Educational
        ],
      },
      tags: {
        create: [
          { tagId: tags[0].id }, // magic
          { tagId: tags[1].id }, // friendship
          { tagId: tags[7].id }, // robots
        ],
      },
      chapters: {
        create: [
          {
            title: 'The Yard Sale',
            content: `Kai didn't want to be at the yard sale. He didn't want to be anywhere, actually. Tomorrow was his first day at a new school — his third new school in two years — and he was tired of starting over. Tired of being the new kid. Tired of not having friends.

But his mom had dragged him along, so here he was, standing in a stranger's driveway while his mom looked at ceramic cats.

Then he saw it — a backpack. It was old and worn, with faded patches and a buckle that looked like it was made of real gold. It sat on a table between a broken clock and a dusty encyclopedia, and something about it made Kai walk closer.

"You like that?" An old woman with kind eyes and silver hair appeared beside him. "It's been waiting for someone special."

"It's just a backpack," Kai said, even though he didn't believe that. There was something about the backpack that made the air feel... tingly.

"Try it on," the woman said.

Kai slipped his arms through the straps. The backpack fit perfectly — not too big, not too small. And inside the front pocket, he found a small notebook and a pencil.

"The rules are simple," the woman said. "Draw what you need, not what you want. And always, always clean up after yourself."

"Rules? For a backpack?" Kai laughed.

But the woman just smiled. "You'll see. Five dollars, please."

Kai bought the backpack for his allowance money. He didn't know yet that his life was about to get a whole lot more interesting.`,
            order: 1,
            duration: 3,
          },
          {
            title: 'The First Drawing',
            content: `That evening, Kai sat on his bed and stared at the notebook. "Draw what you need, not what you want," he muttered. "What does that even mean?"

He decided to test it. He drew a simple apple — not because he needed an apple, but because it seemed like a safe thing to try.

Nothing happened.

"Figures," Kai said, tossing the notebook onto his desk. "It's just a regular—"

And then the backpack started to glow. A soft, warm light seeped through the fabric. Kai grabbed the backpack and opened it, and inside — sitting on top of his math textbook — was a perfect, red apple.

"No way," Kai breathed. He picked up the apple. It was real. Cold from the fridge real. He took a bite. Crisp and sweet.

"NO WAY!"

Kai spent the next hour drawing things. A pencil (it appeared!). A granola bar (delicious!). A tiny robot (it walked around his desk for thirty seconds before disappearing with a soft "pop!").

Then he got ambitious. He drew a hundred-dollar bill. The backpack glowed... but nothing came out. Instead, the notebook's page turned blank, and words appeared:

"Draw what you NEED, not what you WANT."

Kai stared at the message. The backpack was talking to him. Through the notebook. This was the coolest thing that had ever happened to anyone, ever.

He tried again. This time, he drew something he actually needed: a friend. He drew a simple stick figure with a smile.

The backpack glowed brighter than ever. And when Kai opened it, he found a folded piece of paper. On it, written in golden ink:

"Friends can't be drawn. They have to be made. But I can help with that. Check your left pocket."

Kai reached into the left pocket and found a small compass — but instead of pointing north, it pointed toward... something. The needle was pointing out his bedroom window, toward the park down the street.

Kai grabbed his jacket and the backpack and followed the compass into the evening.`,
            order: 2,
            duration: 3,
          },
          {
            title: 'The Compass Points',
            content: `The compass led Kai to the park, where a girl about his age was sitting on a swing, drawing in a notebook. She had paint on her nose and leaves in her hair, and she looked about as lonely as Kai felt.

"Hi," Kai said, sitting on the swing next to her. "I'm Kai. I just moved here."

"I'm Zara," the girl said. "I've lived here forever, but I don't have many friends. People think I'm weird because I'd rather draw than talk."

"That's not weird," Kai said. "That's cool. What are you drawing?"

Zara showed him her notebook. She'd drawn an incredible dragon — detailed and beautiful, with scales that looked real enough to touch.

"Wow," Kai said. "That's amazing. I can barely draw a stick figure."

"Everyone has their own kind of magic," Zara said with a shy smile.

Kai felt the backpack warm against his back. He realized then what the compass had been pointing toward — not a thing, but a person. Someone who needed a friend just as much as he did.

They talked for hours. About art, about being lonely, about what it felt like to be the odd one out. Kai showed Zara his notebook, and she was fascinated.

"A magic backpack that makes your drawings real?" Zara's eyes were huge. "That's the most incredible thing I've ever heard!"

"Want to see something cool?" Kai asked. He drew a tiny dragon in the notebook — inspired by Zara's drawing. The backpack glowed, and a small, pocket-sized dragon appeared on Kai's palm. It was made of light and warmth, and it curled up in Zara's hands like it belonged there.

"It's beautiful," Zara whispered. The tiny dragon nuzzled her finger and then faded away with a sparkle.

"Draw what you need," Kai said, understanding now. "I needed a friend. And the backpack led me to you."`,
            order: 3,
            duration: 3,
          },
          {
            title: 'The Next Day',
            content: `The next morning was Kai's first day at his new school. He was nervous, but not as nervous as before. He had a friend now, and a magic backpack, and that made him feel like he could handle anything.

At school, Kai used the backpack carefully. When he forgot his lunch, he drew a sandwich (the backpack provided a really good one). When the class needed art supplies for a project, he drew extra markers (the backpack gave him a whole set). And when Zara was too shy to present her drawing to the class, Kai drew her a tiny badge that said "BRAVE" — and when she put it on, she found her voice.

"This is some backpack," Zara whispered as they sat together at lunch.

"It has rules, though," Kai said. "It only gives me what I need, not what I want. And I have to clean up after myself — anything I draw disappears eventually."

"Like the dragon?" Zara asked, a little sadly.

"Like the dragon," Kai confirmed. "But the feelings stay. The memory stays. The friendship stays."

Zara smiled. "That's a pretty good rule, actually."

After school, they walked to the park together. The old woman with silver hair was sitting on the bench, feeding the pigeons.

"How's the backpack?" she asked.

"It's amazing," Kai said. "But I don't understand — why me? Why did you sell it to me?"

The woman's eyes twinkled. "Because you needed it. Not the magic — you needed to believe that you could make friends and find your place in the world. The backpack is just a tool. The real magic was always inside you."

Kai looked at Zara, who was drawing a tiny Kai in her notebook (he had a huge head and funny ears, which was not accurate at all but made him laugh).

"Thank you," Kai told the woman.

"Thank yourself," she said. "You drew what you needed. You were brave enough to follow the compass. And you made a friend — not with magic, but with kindness."

Kai put on his backpack and walked home with Zara, feeling lighter than he had in months. In his notebook, he drew one more thing: a tiny house with two stick figures in the yard, one with a backpack and one with a paintbrush.

The backpack glowed softly, and the drawing stayed. It didn't become real — it didn't need to. It was already real in his heart.

And that, the backpack seemed to say, was the best kind of magic there is.

The End. 🎒✏️✨`,
            order: 4,
            duration: 3,
          },
        ],
      },
    },
  })

  console.log('📖 All 12 stories created!')

  // ==========================================
  // TESTIMONIALS
  // ==========================================
  console.log('💬 Creating testimonials...')
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Sarah Mitchell',
        role: 'Parent of two',
        content: 'StoryNest has completely transformed bedtime in our house. My kids used to fight going to sleep, but now they ASK for bedtime because they can\'t wait to hear the next chapter. The stories are magical and age-appropriate — I couldn\'t ask for more!',
        rating: 5,
        featured: true,
        order: 1,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'David Chen',
        role: 'Father & Teacher',
        content: 'As both a parent and a teacher, I\'m incredibly impressed with StoryNest. The educational stories make learning feel like an adventure, and my students don\'t even realize they\'re learning. The variety of categories means there\'s always something new to discover.',
        rating: 5,
        featured: true,
        order: 2,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Emily Rodriguez',
        role: 'Mom of three',
        content: 'We\'ve tried so many reading apps, but StoryNest is the only one all three of my kids agree on. My 4-year-old loves the animal stories, my 7-year-old is obsessed with the adventure series, and my 10-year-old enjoys the fantasy tales. It brings our family together!',
        rating: 5,
        featured: true,
        order: 3,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'James O\'Brien',
        role: 'Grandparent',
        content: 'I live far from my grandchildren, but StoryNest lets us share stories together over video call. We read a chapter each night, and it\'s become our special tradition. The stories are so well-written that even I look forward to finding out what happens next!',
        rating: 5,
        featured: true,
        order: 4,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Lisa Park',
        role: 'Children\'s Librarian',
        content: 'I recommend StoryNest to every family that visits our library. The stories are thoughtfully crafted, diverse, and always appropriate for young readers. The platform makes reading accessible and exciting for children of all ages and reading levels.',
        rating: 5,
        featured: true,
        order: 5,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Michael Thompson',
        role: 'Parent & Author',
        content: 'As a children\'s book author myself, I\'m particular about the stories my daughter reads. StoryNest consistently delivers high-quality, imaginative content that respects children\'s intelligence while nurturing their creativity. It\'s the gold standard for digital storytelling.',
        rating: 5,
        featured: true,
        order: 6,
      },
    }),
  ])

  // ==========================================
  // BADGES
  // ==========================================
  console.log('🏆 Creating badges...')
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'Bookworm',
        description: 'Read 10 stories to earn this badge',
        icon: '📚',
        category: 'reading',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Streak Star',
        description: 'Maintain a 7-day reading streak',
        icon: '⭐',
        category: 'streak',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Kind Explorer',
        description: 'Share 5 stories with friends',
        icon: '💛',
        category: 'social',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Night Owl',
        description: 'Read 5 bedtime stories',
        icon: '🦉',
        category: 'achievement',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Chapter Champion',
        description: 'Complete 50 chapters',
        icon: '🏅',
        category: 'achievement',
      },
    }),
  ])

  // ==========================================
  // ASSIGN SOME BADGES
  // ==========================================
  console.log('🏅 Assigning badges...')
  await Promise.all([
    prisma.userBadge.create({
      data: { userId: regularUser.id, badgeId: badges[0].id },
    }),
    prisma.userBadge.create({
      data: { userId: regularUser.id, badgeId: badges[1].id },
    }),
    prisma.userBadge.create({
      data: { userId: authorUser.id, badgeId: badges[0].id },
    }),
    prisma.userBadge.create({
      data: { userId: authorUser.id, badgeId: badges[3].id },
    }),
  ])

  // ==========================================
  // FAVORITES
  // ==========================================
  console.log('❤️ Creating favorites...')
  await Promise.all([
    prisma.favorite.create({ data: { userId: regularUser.id, storyId: story1.id } }),
    prisma.favorite.create({ data: { userId: regularUser.id, storyId: story2.id } }),
    prisma.favorite.create({ data: { userId: regularUser.id, storyId: story4.id } }),
    prisma.favorite.create({ data: { userId: regularUser.id, storyId: story9.id } }),
    prisma.favorite.create({ data: { userId: authorUser.id, storyId: story5.id } }),
    prisma.favorite.create({ data: { userId: authorUser.id, storyId: story11.id } }),
  ])

  // ==========================================
  // READING HISTORY
  // ==========================================
  console.log('📖 Creating reading history...')
  await Promise.all([
    prisma.readingHistory.create({
      data: { userId: regularUser.id, storyId: story1.id, progress: 100, lastReadAt: new Date() },
    }),
    prisma.readingHistory.create({
      data: { userId: regularUser.id, storyId: story2.id, progress: 75, lastReadAt: new Date(Date.now() - 86400000) },
    }),
    prisma.readingHistory.create({
      data: { userId: regularUser.id, storyId: story4.id, progress: 33, lastReadAt: new Date(Date.now() - 172800000) },
    }),
    prisma.readingHistory.create({
      data: { userId: authorUser.id, storyId: story5.id, progress: 100, lastReadAt: new Date() },
    }),
  ])

  // ==========================================
  // BOOKMARKS
  // ==========================================
  console.log('🔖 Creating bookmarks...')
  await Promise.all([
    prisma.bookmark.create({
      data: { userId: regularUser.id, storyId: story2.id, note: 'Starlight meets the tree' },
    }),
    prisma.bookmark.create({
      data: { userId: regularUser.id, storyId: story1.id, note: 'Ember finds the garden' },
    }),
    prisma.bookmark.create({
      data: { userId: authorUser.id, storyId: story5.id, note: 'The pageant scene' },
    }),
  ])

  // ==========================================
  // SUBSCRIPTIONS
  // ==========================================
  console.log('💎 Creating subscriptions...')
  await Promise.all([
    prisma.subscription.create({
      data: {
        userId: adminUser.id,
        plan: 'yearly',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.subscription.create({
      data: {
        userId: authorUser.id,
        plan: 'monthly',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.subscription.create({
      data: {
        userId: regularUser.id,
        plan: 'free',
        status: 'active',
      },
    }),
  ])

  // ==========================================
  // CHILD PROFILES
  // ==========================================
  console.log('👶 Creating child profiles...')
  await Promise.all([
    prisma.childProfile.create({
      data: { userId: regularUser.id, name: 'Emma', age: 6, avatar: '🧒', grade: '1st' },
    }),
    prisma.childProfile.create({
      data: { userId: regularUser.id, name: 'Jack', age: 4, avatar: '👶', grade: 'Pre-K' },
    }),
    prisma.childProfile.create({
      data: { userId: authorUser.id, name: 'Mia', age: 8, avatar: '👧', grade: '3rd' },
    }),
  ])

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
