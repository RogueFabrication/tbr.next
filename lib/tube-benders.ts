export type TubeBender = {
  id: string;
  brand?: string;
  model: string;
  priceMin?: number | null;
  priceMax?: number | null;
  maxCapacity?: string;
  power?: string;
  origin?: string;
  breakdown?: { label: string; min: number; max: number; note?: string }[];
};

export function getTubeBenders(): TubeBender[] {
  return [
    {
      id: 'roguefab-m600',
      brand: 'RogueFab',
      model: 'M600 Series',
      priceMin: 1105,
      priceMax: 1755,
      maxCapacity: '2-3/8" OD',
      power: 'Hydraulic',
      origin: 'USA',
      breakdown: [
        { label: 'Frame', min: 795, max: 995 },
        { label: 'Hydraulic Ram', min: 0, max: 450 },
        { label: 'Die Set', min: 185, max: 185 },
        { label: 'Stand/Mount', min: 125, max: 125 },
      ],
    },
    {
      id: 'jd2-model-32',
      brand: 'JD2',
      model: 'Model 32',
      priceMin: 1545,
      priceMax: 1895,
      maxCapacity: '2" OD',
      power: 'Manual',
      origin: 'USA',
    },
    {
      id: 'baileigh-rdb-100',
      brand: 'Baileigh',
      model: 'RDB-100',
      priceMin: 2805,
      priceMax: 3485,
      maxCapacity: '1-1/2" OD',
      power: 'Manual',
      origin: 'Taiwan',
    },
  ];
}

