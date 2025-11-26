export interface LegacyEditorial {
  brand: string;
  model: string;
  description?: string;
  pros: string[];
  cons: string[];
  features: string[];
  materials: string[];
}

export const legacyEditorial: LegacyEditorial[] = [
  {
    brand: "RogueFab",
    model: "M601/M605/M625",
    description: "The RogueFab M6xx series stands out as our top choice for its exceptional combination of performance, customization options, and value. This American-made tube bender offers professional-grade capabilities at a competitive price point with capacity up to 2.375\" OD (larger dies available upon request). Complete setup pricing includes hydraulic ram system, 1.5\" die set, and all mounting hardware - ready to bend out of the box.",
    pros: [
      "Highly customizable with extensive upgrade options",
      "Excellent build quality and American manufacturing",
      "94° bend achievable without hydraulic adjustment (typical first-stroke market performance is 80-85°)",
      "Low entry price with affordable upgrades",
      "Double-acting hydraulic option (fastest on market)",
      "Superior customer support and technical assistance",
      "Fast lead times: Standard dies typically ship within 1-2 weeks"
    ],
    cons: [
      "Many accessories sold separately",
      "No reverse bending attachment included",
      "Warranty covers workmanship, not unlimited coverage"
    ],
    features: [
      "Air/Hydraulic ram upgrade",
      "Pressure roller dies",
      "Thin-wall roller",
      "Backstop",
      "Rotation gauges",
      "Mandrel conversion available"
    ],
    materials: [
      "Mild steel",
      "4130 chromoly",
      "Aluminum",
      "Stainless steel",
      "Titanium"
    ]
  },
  {
    brand: "Baileigh",
    model: "RDB-050",
    description: "The Baileigh RDB-050 is a manual-type tube bender that outperforms expectations with heavy-duty metal bending capacity. Complete setup includes the bender, stand, 1.5\" die set, and degree markings. Additional dies and hydraulic upgrades available separately.",
    pros: [
      "Straightforward operation with clear controls",
      "Heavy-duty capacity roll cage tube bender",
      "Everything comes with the bender itself (except dies)",
      "No added accessories needed",
      "Heavy-duty build quality and performance",
      "Multiple speed control options",
      "Lightweight design"
    ],
    cons: [
      "High price tag for manual operation",
      "Dies and reverse bending attachment not included",
      "No lifetime warranty",
      "Requires mounting to floor with concrete anchors"
    ],
    features: [
      "Three-speed settings",
      "Anti-spring-back mechanism",
      "Stand included",
      "Degree dial",
      "36-inch telescopic handle"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum"
    ]
  },
  {
    brand: "JD2",
    model: "Model 32",
    description: "The JD2 Model 32 follows a proven 25-year-old design with tweaks for improved operation. Complete manual setup includes base unit, stand, and 1.5\" die set. Made-to-order manufacturing means longer lead times but ensures fresh builds.",
    pros: [
      "Affordable with all add-ons and attachments",
      "Simple construction with fewer maintenance issues",
      "Degree pointer for precision bending angles",
      "Good overall performance",
      "Great die selection available",
      "Manufacturer has decades of experience"
    ],
    cons: [
      "No speed or torque control",
      "Must be mounted to floor with concrete anchors",
      "Warranty excludes 3rd party components",
      "No affordable hydraulic power option from manufacturer",
      "Degree indicator can be accidentally moved (reported in user reviews on YouTube and fabrication forums)",
      "Dies sold separately (4-6 week lead time per JD2.com/lead-times as of June 2025)"
    ],
    features: [
      "36-inch telescopic handle",
      "Degree indicator wheel",
      "CNC machined surfaces",
      "25-year proven design"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum"
    ]
  },
  {
    brand: "JD2",
    model: "Model 32-H",
    description: "The JD2 Model 32 Hydraulic combines the proven manual design with a complete hydraulic system. Setup includes base unit, stand, hydraulic pump with controls, and 1.5\" die set. Made-to-order manufacturing ensures fresh builds with latest improvements.",
    pros: [
      "Proven 25-year design reliability",
      "Made in USA with quality construction",
      "Double-acting hydraulic system",
      "Extensive die selection available",
      "Strong aftermarket support",
      "Consistent power delivery"
    ],
    cons: [
      "Higher price than manual version",
      "Degree indicator can be accidentally moved (reported in user reviews on YouTube and fabrication forums)",
      "Dies sold separately (4-6 week lead time per JD2.com/lead-times as of June 2025)",
      "Requires electrical connection for pump"
    ],
    features: [
      "Double-acting hydraulic ram",
      "Electric pump with controls",
      "Degree markings",
      "Heavy-duty stand",
      "Quick-change tooling"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum"
    ]
  },
  {
    brand: "Woodward Fab",
    model: "WFB2",
    description: "The Woodward Fab WFB2 offers an entry-level solution for light fabrication work. Complete setup includes base unit, basic stand, and 1.5\" die set. While build quality reflects the budget price point, it provides adequate performance for hobby work and light commercial applications.",
    pros: [
      "Very affordable price point",
      "CNC machined components",
      "Engraved degree dial",
      "Space-saving design",
      "Works with square and round tubes"
    ],
    cons: [
      "No provision for extendable handle",
      "Built-in handle only 27 inches",
      "Budget-focused construction",
      "Stand sold separately",
      "Limited material compatibility",
      "Short warranty period"
    ],
    features: [
      "29-inch handle",
      "Engraved degree dial",
      "CNC machined components",
      "Compact design"
    ],
    materials: [
      "Mild Steel",
      "Aluminum"
    ]
  },
  {
    brand: "JMR Manufacturing",
    model: "TBM-250R",
    description: "The JMR TBM-250R RaceLine offers American-made quality at an accessible price point. Features 3-speed manual operation with heat-treated components and upgrade path to hydraulics. Complete setup includes bender frame, degree ring, and warranty.",
    pros: [
      "American-made quality construction",
      "3-speed manual operation",
      "Heat treated 4140 steel pins",
      "Upgradeable to hydraulic power",
      "Fast shipping (typically 1 week)",
      "Nylon/graphite bushings at pivot points"
    ],
    cons: [
      "Dies sold separately (4-6 week lead time per JMR website)",
      "Uncoated steel arms require maintenance",
      "Higher price than budget options",
      "Limited to 2\" capacity without hydraulic upgrade"
    ],
    features: [
      "3-speed operation",
      "Degree ring with pointer",
      "Heat-treated pins",
      "Hydraulic upgrade path"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum",
      "Stainless Steel"
    ]
  },
  {
    brand: "JMR Manufacturing",
    model: "TBM-250U RaceLine",
    description: "The JMR TBM-250U Ultra represents the pinnacle of manual tube bender construction. Features bronze bushings, powder-coated finish, and 5-speed operation. Professional-grade build quality with hydraulic upgrade capability to 2.5\" capacity.",
    pros: [
      "Premium JMR construction quality",
      "Bronze bushings for smooth operation",
      "Powder-coated finish",
      "5-speed operation for precision",
      "Upgradeable to 2.5\" with hydraulics",
      "Fast shipping and strong support"
    ],
    cons: [
      "Highest price in manual category",
      "Dies sold separately with lead times",
      "Requires floor mounting for stability",
      "Premium features may be overkill for hobby use"
    ],
    features: [
      "5-speed operation",
      "Bronze bushings",
      "Powder-coated finish",
      "Premium construction"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum",
      "Stainless Steel"
    ]
  },
  {
    brand: "Pro-Tools",
    model: "105HD",
    description: "The Pro-Tools 105HD represents American manufacturing excellence with heavy-duty construction. Features 5/8\" thick frame arms and steel bushings. Complete packages available with dies, or buy components separately for custom setups.",
    pros: [
      "Heavy-duty 5/8\" thick main frame arms",
      "100% USA designed and manufactured",
      "Steel bushings for durability",
      "Integrated degree plate included",
      "Hydraulic upgrade available",
      "Strong reputation in professional market"
    ],
    cons: [
      "Higher price point for manual operation",
      "Steel bushings require more maintenance than bronze",
      "Limited wall thickness (0.134\" max)",
      "Dies packages increase total cost significantly"
    ],
    features: [
      "5/8\" thick frame arms",
      "Steel bushings",
      "Degree plate",
      "USA manufactured"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum"
    ]
  },
  {
    brand: "Pro-Tools",
    model: "BRUTE",
    description: "The Pro-Tools BRUTE sets the standard for hydraulic tube bending with 2.5\" capacity and 15-ton power. Features 1\" thick frame construction and CNC machined components throughout. Built for production environments and professional fabrication shops.",
    pros: [
      "Highest capacity at 2.5\" tube capability",
      "15-ton hydraulic cylinder with 16\" stroke",
      "1\" thick main bending frame",
      "Integrated CNC machined degree ring",
      "100% USA designed and assembled",
      "Professional production capability"
    ],
    cons: [
      "Highest price point in comparison",
      "Requires compressed air for operation",
      "Heavy unit requiring permanent installation",
      "Dies sold separately at premium pricing"
    ],
    features: [
      "15-ton hydraulic cylinder",
      "1\" thick frame",
      "CNC machined degree ring",
      "2.5\" capacity"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum",
      "Stainless Steel"
    ]
  },
  {
    brand: "Mittler Bros",
    model: "2500-HD",
    description: "The Mittler Bros Model 2500 combines traditional American manufacturing with modern hydraulic power. Features 25-ton ram capacity and 180° bending capability. Available with portable stand for shop flexibility.",
    pros: [
      "25-ton hydraulic ram capacity",
      "180° bending capability",
      "Portable work stand available",
      "Established manufacturer with long history",
      "Heavy-duty construction",
      "Good aftermarket support"
    ],
    cons: [
      "Higher price than manual alternatives",
      "Requires hydraulic pump setup",
      "Heavy unit for portable applications",
      "Limited material compatibility compared to competitors"
    ],
    features: [
      "25-ton hydraulic ram",
      "180° bending",
      "Portable stand option",
      "Heavy-duty design"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum"
    ]
  },
  {
    brand: "Hossfeld",
    model: "Standard No. 2",
    description: "The Hossfeld Standard Model No. 2 represents over 100 years of bending innovation. Features universal design for tube, pipe, flat bar, and angle iron. Extensive tooling catalog available with hydraulic upgrade options.",
    pros: [
      "100+ years of manufacturing experience",
      "Largest selection of tooling available",
      "Universal design handles multiple materials",
      "Hydraulic power option available",
      "Classic proven design",
      "Strong resale value"
    ],
    cons: [
      "Older design lacks modern conveniences",
      "Tooling costs add up quickly",
      "Learning curve for optimal setup",
      "Manual operation requires significant effort"
    ],
    features: [
      "Universal material capability",
      "Extensive tooling catalog",
      "100+ year heritage",
      "Hydraulic upgrade option"
    ],
    materials: [
      "Mild Steel",
      "Chromoly",
      "Aluminum",
      "Flat Bar",
      "Angle Iron"
    ]
  },
  {
    brand: "SWAG Off Road",
    model: "REV 2",
    description: "The SWAG Off Road REV 2 represents the pinnacle of precision tube bending equipment. Designed, machined, and assembled in Oregon, USA, it features exceptional tolerances and professional-grade components throughout.",
    pros: [
      "Exceptional build quality and tight tolerances",
      "Oil-impregnated bronze bushings for smooth operation",
      "Precision machined aluminum degree wheel",
      "95% pre-assembled for quick setup",
      "Superior repeatability compared to competitors",
      "Made in USA with premium materials"
    ],
    cons: [
      "Proprietary die system (not compatible with JD2)",
      "Higher initial cost than basic alternatives",
      "Currently limited die selection compared to established brands",
      "Dies sold separately unless specifically bundled"
    ],
    features: [
      "Precision machined components",
      "Oil-impregnated bronze bushings",
      "Machined aluminum degree wheel",
      "2\" receiver hitch mount"
    ],
    materials: [
      "Round Tube",
      "DOM Tubing",
      "Chromoly"
    ]
  }
];

