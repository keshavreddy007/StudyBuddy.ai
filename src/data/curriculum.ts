/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClassLevel, Stream, Chapter } from '../types';

export const CURRICULUM_DATA: Record<ClassLevel, Record<Stream | 'General', Chapter[]>> = {
  '10': {
    'General': [
      {
        id: '10-math-algebra',
        name: 'Mathematics: Algebra (Quadratic Equations)',
        topics: [
          {
            id: '10-math-quad-formula',
            name: 'Quadratic Formula & Nature of Roots',
            notes: `### Quadratic Equations in One Variable
A quadratic equation in the variable $x$ is an equation of the form **$ax^2 + bx + c = 0$**, where $a, b, c$ are real numbers and $a \\neq 0$.

### Roots of a Quadratic Equation
A real number $\\alpha$ is called a root of the quadratic equation if $a\\alpha^2 + b\\alpha + c = 0$.

### Quadratic Formula
The roots of the equation are given by:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

The term **$D = b^2 - 4ac$** is called the **Discriminant** of the quadratic equation.

### Nature of Roots
The discriminant $D$ determines the nature of the roots:
1. **$D > 0$**: Two distinct real roots ($\frac{-b + \sqrt{D}}{2a}$ and $\frac{-b - \sqrt{D}}{2a}$).
2. **$D = 0$**: Two equal (coincident) real roots ($-\frac{b}{2a}$).
3. **$D < 0$**: No real roots (roots are complex/imaginary).`,
            formulas: [
              'ax^2 + bx + c = 0 \\quad (a \\neq 0)',
              'Discriminant: D = b^2 - 4ac',
              'Roots: x = \\frac{-b \\pm \\sqrt{D}}{2a}',
              'Sum of Roots: \\alpha + \\beta = -\\frac{b}{a}',
              'Product of Roots: \\alpha \\beta = \\frac{c}{a}'
            ],
            pyqs: [
              {
                id: '10-pyq-1',
                year: 2023,
                examName: 'CBSE Board',
                question: 'Find the values of $k$ for which the quadratic equation $2x^2 + kx + 3 = 0$ has two equal real roots.',
                answer: '$k = \\pm 2\\sqrt{6}$',
                explanation: 'For equal roots, Discriminant $D = b^2 - 4ac = 0$. In this equation, $a=2, b=k, c=3$. Therefore, $k^2 - 4(2)(3) = 0 \\implies k^2 - 24 = 0 \\implies k^2 = 24 \\implies k = \\pm \\sqrt{24} = \\pm 2\\sqrt{6}$.'
              }
            ],
            practiceProblems: [
              {
                id: '10-practice-1',
                question: 'If the roots of the equation $(b-c)x^2 + (c-a)x + (a-b) = 0$ are equal, then of the following, which one is correct?',
                options: [
                  '2b = a + c',
                  '2a = b + c',
                  '2c = a + b',
                  'b = a + c'
                ],
                correctIndex: 0,
                difficulty: 'Medium',
                explanation: 'Sum of coefficients in a quadratic equation of form $px^2 + qx + r = 0$ with equal roots being 0 ($p+q+r = b-c+c-a+a-b = 0$) means $x=1$ is a root. Since roots are equal, the other root is also $x=1$. Product of roots is $\\frac{a-b}{b-c} = 1 \\implies a-b = b-c \\implies 2b = a+c$.'
              },
              {
                id: '10-practice-2',
                question: 'Solve for x: $x^2 - 5x + 6 = 0$.',
                options: [
                  'x = 1, 6',
                  'x = 2, 3',
                  'x = -2, -3',
                  'x = 0, 5'
                ],
                correctIndex: 1,
                difficulty: 'Easy',
                explanation: 'Factoring the quadratic equation gives $(x-2)(x-3) = 0$, which gives roots $x = 2$ and $x = 3$.'
              }
            ],
            flashcards: [
              {
                id: '10-fc-1',
                term: 'Discriminant',
                definition: 'The value $D = b^2 - 4ac$ that determines whether the roots of a quadratic equation are real, distinct, equal, or imaginary.'
              },
              {
                id: '10-fc-2',
                term: 'Roots',
                definition: 'Values of $x$ that satisfy the equation $f(x) = 0$. Also known as solutions or zeroes.'
              }
            ]
          }
        ]
      },
      {
        id: '10-sci-light',
        name: 'Science: Light (Reflection & Refraction)',
        topics: [
          {
            id: '10-sci-spherical-mirrors',
            name: 'Spherical Mirrors and Lens Formula',
            notes: `### Reflection of Light
Reflection is the bouncing back of light rays when they hit an opaque surface.

### Spherical Mirrors
1. **Concave Mirror**: Curved inwards. Can form both real (inverted) and virtual (erect) images depending on the object's distance.
2. **Convex Mirror**: Curved outwards. Always forms a virtual, erect, and diminished image.

### Mirror Formula
$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$
Where:
- $f$ = Focal length
- $v$ = Image distance
- $u$ = Object distance

### Magnification (m)
$$m = \\frac{h_i}{h_o} = -\\frac{v}{u}$$

### Lens Formula (Refraction)
$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$$
Magnification for lens: $m = \\frac{v}{u}$.`,
            formulas: [
              'Mirror\\,Formula: \\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}',
              'Lens\\,Formula: \\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}',
              'Refractive\\,Index: n = \\frac{c}{v}',
              'Power\\,of\\,Lens: P = \\frac{1}{f \\quad \\text{(in meters)}}'
            ],
            pyqs: [
              {
                id: '10-sci-pyq-1',
                year: 2022,
                examName: 'CBSE Board',
                question: 'An object is placed at a distance of 15 cm from a convex mirror of focal length 10 cm. Find the position of the image.',
                answer: 'v = +6 cm (behind the mirror)',
                explanation: 'Using Mirror Formula: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$. Given $u = -15\\text{ cm}$ (Sign convention) and $f = +10\\text{ cm}$ (for convex mirror). $\\frac{1}{10} = \\frac{1}{v} + \\frac{1}{-15} \\implies \\frac{1}{v} = \\frac{1}{10} + \\frac{1}{15} = \\frac{3+2}{30} = \\frac{5}{30} = \\frac{1}{6} \\implies v = 6\\text{ cm}$.'
              }
            ],
            practiceProblems: [
              {
                id: '10-sci-pract-1',
                question: 'Which of the following mirrors is used by dentists to see a magnified image of teeth?',
                options: [
                  'Convex mirror',
                  'Concave mirror',
                  'Plane mirror',
                  'Bifocal mirror'
                ],
                correctIndex: 1,
                difficulty: 'Easy',
                explanation: 'A concave mirror produces a virtual, erect, and magnified image of an object when placed close to it (between Pole and Focus), making it highly useful for dentists.'
              }
            ],
            flashcards: [
              {
                id: '10-sci-fc-1',
                term: 'Refraction',
                definition: 'The bending of a light ray as it passes obliquely from one transparent medium to another due to a change in its speed.'
              }
            ]
          }
        ]
      }
    ],
    'PCM': [],
    'PCB': [],
    'Commerce': []
  },
  '11': {
    'PCM': [
      {
        id: '11-phy-kinematics',
        name: 'Physics: Kinematics (Motion in a Straight Line)',
        topics: [
          {
            id: '11-phy-equations',
            name: 'Equations of Motion & Vectors',
            notes: `### Kinematic Parameters
- **Displacement ($s$):** Vector quantity representing shortest path from initial to final state.
- **Velocity ($v$):** Rate of change of position coordinate. $v = \\frac{ds}{dt}$.
- **Acceleration ($a$):** Rate of change of velocity. $a = \\frac{dv}{dt}$.

### Uniformly Accelerated Motion
If particle moves with a constant acceleration $a$, we use the equations of motion:
1. $$v = u + at$$
2. $$s = ut + \\frac{1}{2}at^2$$
3. $$v^2 = u^2 + 2as$$
4. $$s_n = u + \\frac{a}{2}(2n - 1) \\quad \\text{(Displacement in } n^{\\text{th}} \\text{ second)}$$

### Relative Motion
Relative velocity of object A w.r.t object B is given by:
$$\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B$$`,
            formulas: [
              'v = u + at',
              's = ut + \\frac{1}{2}at^2',
              'v^2 = u^2 + 2as',
              'v_{avg} = \\frac{u+v}{2} \\quad \\text{(only for constant acceleration)}'
            ],
            pyqs: [
              {
                id: '11-phy-pyq-1',
                year: 2022,
                examName: 'JEE Mains',
                question: 'A ball is thrown vertically upwards with a velocity of $20\\text{ m/s}$ from the top of a tower of height $25\\text{ m}$. Find the total time taken by the ball before hitting the ground. (Take $g = 10\\text{ m/s}^2$)',
                answer: '5 seconds',
                explanation: 'Using formula $s = ut + \\frac{1}{2}at^2$. Taking upward direction as positive. Here, displacements $s = -25\\text{ m}$, initial velocity $u = +20\\text{ m/s}$, acceleration $a = -g = -10\\text{ m/s}^2$. So, $-25 = 20t - 5t^2 \\implies 5t^2 - 20t - 25 = 0 \\implies t^2 - 4t - 5 = 0 \\implies (t-5)(t+1) = 0$. Since time cannot be negative, $t = 5\\text{ seconds}$.'
              }
            ],
            practiceProblems: [
              {
                id: '11-phy-pract-1',
                question: 'The displacement of a particle moving in a straight line is given by $x = 2t^3 - 3t^2 + 5\\text{ m}$. What is the acceleration of the particle when its velocity becomes zero?',
                options: [
                  '6 m/s²',
                  '12 m/s²',
                  '-6 m/s²',
                  '0 m/s²'
                ],
                correctIndex: 0,
                difficulty: 'Hard',
                explanation: 'Velocity $v = \\frac{dx}{dt} = 6t^2 - 6t$. Setting $v = 0 \\implies 6t(t-1) = 0 \\implies t = 1\\text{ s}$ (excluding start $t=0$). Acceleration $a = \\frac{dv}{dt} = 12t - 6$. At $t=1$, $a = 12(1) - 6 = 6\\text{ m/s}^2$.'
              }
            ],
            flashcards: [
              {
                id: '11-phy-fc-1',
                term: 'Instantaneous Acceleration',
                definition: 'The acceleration of an object at a specific instant of time, mathematically defined as the derivative of velocity w.r.t time: a = dv/dt.'
              }
            ]
          }
        ]
      },
      {
        id: '11-chem-bonding',
        name: 'Chemistry: Chemical Bonding',
        topics: [
          {
            id: '11-chem-hybridization',
            name: 'Hybridization, VSEPR and Molecular Shapes',
            notes: `### Valence Shell Electron Pair Repulsion (VSEPR) Theory
VSEPR theory simulates molecular geometries based on minimizing the electron-pair repulsions around the central atom.
Order of repulsive force strength:
$$\\text{Lone Pair - Lone Pair (lp-lp)} > \\text{Lone Pair - Bond Pair (lp-bp)} > \\text{Bond Pair - Bond Pair (bp-bp)}$$

### Hybridization Index (Steric Number)
The steric number ($H$) determines hybridization:
$$H = \\frac{1}{2} [V + M - C + A]$$
Where:
- $V$ = Valence electrons on central atom
- $M$ = Number of monovalent atoms attached directly
- $C$ = Cationic positive charge
- $A$ = Anionic negative charge

| H Value | Hybridization | Basic Geometry | Example |
|---|---|---|---|
| 2 | sp | Linear | $CO_2$ |
| 3 | $sp^2$ | Trigonal Planar | $BF_3$ |
| 4 | $sp^3$ | Tetrahedral | $CH_4$ |
| 5 | $sp^3d$ | Trigonal Bipyramidal | $PCl_5$ |
| 6 | $sp^3d^2$ | Octahedral | $SF_6$ |`,
            formulas: [
              'Steric\\,Number: H = \\frac{1}{2}(V + M - C + A)',
              'Formal\\,Charge: FC = [V] - [L] - \\frac{1}{2}[B]'
            ],
            pyqs: [
              {
                id: '11-chem-pyq-1',
                year: 2021,
                examName: 'JEE Mains',
                question: 'Which of the following compounds has the highest number of lone pairs on the central atom?',
                answer: '$XeF_2$ (3 lone pairs)',
                explanation: '$XeF_2$ central atom is Xenon (8 valence electrons). Attached atoms: 2 Fluorine ($M=2$). Steric configuration $H = (8 + 2)/2 = 5 \\implies sp^3d$ hybridization. Out of 5 coordinates, 2 are bond pairs, meaning there are $5 - 2 = 3$ lone pairs.'
              }
            ],
            practiceProblems: [
              {
                id: '11-chem-pract-1',
                question: 'What is the hybridization and molecular geometry of $SF_4$?',
                options: [
                  'sp³d, See-saw',
                  'sp³d², Square Planar',
                  'sp³, Tetrahedral',
                  'sp³d, Trigonal Bipyramidal'
                ],
                correctIndex: 0,
                difficulty: 'Medium',
                explanation: 'For $SF_4$, Central atom S has 6 valence electrons, Monovalent atoms F = 4. $H = 1/2(6 + 4) = 5 \\implies sp^3d$. It contains 4 Bond Pairs and 1 Lone Pair. Geometric shape becomes See-saw due to axial distortion.'
              }
            ],
            flashcards: [
              {
                id: '11-chem-fc-1',
                term: 'Hybridization',
                definition: 'The concept of mixing atomic orbitals to generate new hybrid orbitals which are suitable for description of covalent bonds.'
              }
            ]
          }
        ]
      }
    ],
    'PCB': [
      {
        id: '11-bio-cell',
        name: 'Biology: Cell Structure and Division',
        topics: [
          {
            id: '11-bio-mitosis',
            name: 'Mitosis vs Meiosis & Cell Cycle Phases',
            notes: `### The Cell Cycle
The cell cycle consists of two basic phases:
1. **Interphase**: Period of preparation (95% of cycle duration). Divisible into:
   - **$G_1$ phase (Gap 1):** Cell growth, synthesis of RNA/proteins.
   - **$S$ phase (Synthesis):** DNA replication occurs. Centrioles duplicate.
   - **$G_2$ phase (Gap 2):** Tubulin synthesis for spindle fibres.
2. **M Phase (Mitosis/Meiosis)**: Direct cellular division.

### Mitosis
An **equational division** where parent chromosome number ($2n$) is maintained in the two daughter nuclei.
- **Prophase**: Chromatin condensation, nuclear envelope breaks down.
- **Metaphase**: Alignment of equatorial chromosomes at the metaphase plate.
- **Anaphase**: Centromere splits, sister chromatids migrate to opposite poles.
- **Telophase**: Chromosomes decondense, nuclear envelope reforms.

### Meiosis
A **reductional division** leading to haploid cell formations ($n$). Prominent features include homologous crossing over during **Prophase I (Pachynema stage)**.`,
            formulas: [
              'No.\\,of\\,mitotic\\,divisions\\,for\\,N\\,cells = N - 1',
              'No.\\,of\\,meiotic\\,divisions\\,for\\,P\\,seeds = P + \\frac{P}{4}'
            ],
            pyqs: [
              {
                id: '11-bio-pyq-1',
                year: 2022,
                examName: 'NEET UG',
                question: 'In which stage of cellular division does crossing over take place between homologous chromosomes?',
                answer: 'Pachytene of Prophase I',
                explanation: 'Recombination or crossing over takes place in the Pachytene stage of Prophase I of Meiosis I. This process is mediated by the enzyme recombinase.'
              }
            ],
            practiceProblems: [
              {
                id: '11-bio-pract-1',
                question: 'If a diploid cell has 12 chromosomes in G1 phase, how many chromatids will be present in metaphase?',
                options: [
                  '12',
                  '24',
                  '48',
                  '6'
                ],
                correctIndex: 1,
                difficulty: 'Hard',
                explanation: 'In G1 phase, number of chromosomes is 12, each having one chromatid. During S phase, DNA replication doubles the amount of DNA but keeping chromosome count same. In Metaphase, each of the 12 chromosomes will have 2 sister chromatids, totalling 24 chromatids.'
              }
            ],
            flashcards: [
              {
                id: '11-bio-fc-1',
                term: 'Crossing Over',
                definition: 'The reciprocal exchange of genetic material between non-sister chromatids of homologous chromosomes during meiosis.'
              }
            ]
          }
        ]
      }
    ],
    'Commerce': [],
    'General': []
  },
  '12': {
    'PCM': [
      {
        id: '12-phy-electrostatics',
        name: 'Physics: Electrostatics & Fields',
        topics: [
          {
            id: '12-phy-gauss-law',
            name: "Coulomb's Law, Gauss's Law and Flux",
            notes: `### Coulomb's Law
The electrostatic force of attraction or repulsion between two point charges $q_1$ and $q_2$ separated by distance $r$ is given by:
$$F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}$$
Where $\\frac{1}{4\\pi\\varepsilon_0} = 9 \\times 10^9 \\text{ N m}^2 \\text{C}^{-2}$.

### Electric Flux (\\Phi)
Electric flux represents the number of electric field lines passing through a closed surface area:
$$\\Phi = \\oint \\vec{E} \\cdot d\\vec{A} = E A \\cos\\theta$$

### Gauss's Law
The total electric flux passing out of a closed surface of any shape is equal to $1/\\varepsilon_0$ times the net charge enclosed inside:
$$\\Phi_{net} = \\oint \\vec{E} \cdot d\\vec{A} = \\frac{q_{enclosed}}{\\varepsilon_0}$$

### Electric Potential
$$\\int \\vec{E} \\cdot d\\vec{r} = -V$$`,
            formulas: [
              'Force: F = K \\frac{q_1 q_2}{r^2}',
              'Electric\\,Field\\,(Point\\,Charge): E = K \\frac{q}{r^2}',
              'Gauss\\,Flux: \\Phi = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{in}}{\\varepsilon_0}',
              'Capacitance: C = \\frac{\\varepsilon_0 A}{d}'
            ],
            pyqs: [
              {
                id: '12-phy-pyq-1',
                year: 2023,
                examName: 'JEE Mains',
                question: 'A spherical conductor of radius $10\\text{ cm}$ has a charge of $3.2 \\times 10^{-7}\\text{ C}$ distributed uniformly. Find the electric field at a point $15\\text{ cm}$ from the center of the sphere.',
                answer: '1.28 \times 10^5 N/C',
                explanation: 'Since the point ($r = 15\\text{ cm} = 0.15\\text{ m}$) is outside the sphere ($R = 10\\text{ cm}$), the charge can be considered as concentrated at the center. $E = \\frac{Kq}{r^2} = \\frac{(9 \\times 10^9) \\times (3.2 \\times 10^{-7})}{(0.15)^2} = \\frac{2880}{0.0225} = 1.28 \\times 10^5\\text{ N/C}$.'
              }
            ],
            practiceProblems: [
              {
                id: '12-phy-pract-1',
                question: 'The electric flux through a cubical surface of side $10\\text{ cm}$ enclosing a point charge $q$ is $\\Phi$. If the side of the cube is doubled, the flux will become:',
                options: [
                  '\\Phi / 2',
                  '2\\Phi',
                  '\\Phi',
                  '4\\Phi'
                ],
                correctIndex: 2,
                difficulty: 'Easy',
                explanation: "According to Gauss's Law, the total electric flux is solely dependent on the enclosed charge (Φ = q/ε₀) and is independent of the geometry or dimension of the enclosing gaussian surface."
              }
            ],
            flashcards: [
              {
                id: '12-phy-fc-1',
                term: "Gauss's Law",
                definition: 'The law stating that the net electric flux through any closed surface is equal to the net charge enclosed by that surface divided by permittivity.'
              }
            ]
          }
        ]
      }
    ],
    'PCB': [
      {
        id: '12-bio-genetics',
        name: 'Biology: Genetics & Heredity',
        topics: [
          {
            id: '12-bio-mendel',
            name: 'Mendelian Genetics, Monohybrid Crossed ratios',
            notes: `### Laws of inheritance (Gregor Mendel)
Mendel formulated three fundamental principles of heredity:
1. **Law of Dominance**: In a heterozygous pair of alleles, one will repress the phenotypic display of the other.
2. **Law of Segregation**: Alleles segregate during gamete formation so that each gamete contains only one allele.
3. **Law of Independent Assortment**: Genes for different traits segregate independently during the formation of gametes.

### Monohybrid Cross Ratio
Crossing pure Tall ($TT$) and Dwarf ($tt$) plants:
- **$F_1$ Generation**: All Tall ($Tt$)
- **$F_2$ Phenotypic Ratio**: **3 Tall : 1 Dwarf** ($3:1$)
- **$F_2$ Genotypic Ratio**: **1 TT : 2 Tt : 1 tt** ($1:2:1$)

### Dihybrid Cross Ratio
Crossing Round Yellow ($RRYY$) and Wrinkled Green ($rryy$):
- **$F_2$ Phenotypic Ratio**: **9 : 3 : 3 : 1** (9 Round Yellow, 3 Round Green, 3 Wrinkled Yellow, 1 Wrinkled Green).`,
            formulas: [
              'No.\\,of\\,phenotypes\\,in\\,heterozygous\\,cross = 2^n',
              'No.\\,of\\,genotypes\\,in\\,heterozygous\\,cross = 3^n \\quad \\text{(where } n \\text{ is number of genes)}'
            ],
            pyqs: [
              {
                id: '12-bio-pyq-1',
                year: 2022,
                examName: 'NEET UG',
                question: 'Which of the following represents the correct F2 genotypic ratio of a Mendel-style monohybrid cross?',
                answer: '1 : 2 : 1',
                explanation: 'The genotypic ratio of a monohybrid cross is 1 homozygous dominant (TT) : 2 heterozygous dominant (Tt) : 1 homozygous recessive (tt), which corresponds to 1:2:1.'
              }
            ],
            practiceProblems: [
              {
                id: '12-bio-pract-1',
                question: 'How many different types of gametes can be produced by a plant with genotype AaBbCc?',
                options: [
                  '4',
                  '6',
                  '8',
                  '16'
                ],
                correctIndex: 2,
                difficulty: 'Medium',
                explanation: 'The number of gametes can be found using the formula $2^n$ where $n$ is the number of heterozygous loci. Here, Aa, Bb, and Cc are all heterozygous, so $n = 3$. Number of different gametes = $2^3 = 8$.'
              }
            ],
            flashcards: [
              {
                id: '12-bio-fc-1',
                term: 'Allele',
                definition: 'Alternative forms of a gene that occupy the same position (locus) on a chromosome.'
              }
            ]
          }
        ]
      }
    ],
    'Commerce': [],
    'General': []
  }
};

// Also copy PCM and PCB for secondary classes
CURRICULUM_DATA['11']['PCB'].unshift(...CURRICULUM_DATA['11']['PCM'].filter(c => !c.id.includes('math')));
CURRICULUM_DATA['12']['PCB'].unshift(...CURRICULUM_DATA['12']['PCM'].filter(c => !c.id.includes('math')));

// Fallback lookup functions to serve UI cleanly
export function getSubjectChapters(classLevel: ClassLevel, stream: Stream): Chapter[] {
  const streamKey = (classLevel === '10') ? 'General' : stream;
  const list = CURRICULUM_DATA[classLevel]?.[streamKey as any] || [];
  if (list.length === 0) {
    // Return all items if stream list is somehow blank as a safe default
    return CURRICULUM_DATA[classLevel]?.['General'] || CURRICULUM_DATA[classLevel]?.['PCM'] || [];
  }
  return list;
}
