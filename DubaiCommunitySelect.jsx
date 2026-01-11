import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const DUBAI_COMMUNITIES = [
  { value: 'downtown', label: 'Downtown Dubai', area: 'Central' },
  { value: 'marina', label: 'Dubai Marina', area: 'Coastal' },
  { value: 'jbr', label: 'Jumeirah Beach Residence (JBR)', area: 'Coastal' },
  { value: 'jlt', label: 'Jumeirah Lake Towers (JLT)', area: 'Central' },
  { value: 'business_bay', label: 'Business Bay', area: 'Central' },
  { value: 'deira', label: 'Deira', area: 'Old Dubai' },
  { value: 'bur_dubai', label: 'Bur Dubai', area: 'Old Dubai' },
  { value: 'international_city', label: 'International City', area: 'East' },
  { value: 'discovery_gardens', label: 'Discovery Gardens', area: 'West' },
  { value: 'jvc', label: 'Jumeirah Village Circle (JVC)', area: 'South' },
  { value: 'arabian_ranches', label: 'Arabian Ranches', area: 'South' },
  { value: 'dubai_hills', label: 'Dubai Hills Estate', area: 'South' },
  { value: 'silicon_oasis', label: 'Dubai Silicon Oasis', area: 'East' },
  { value: 'sports_city', label: 'Dubai Sports City', area: 'South' },
  { value: 'motor_city', label: 'Motor City', area: 'South' },
  { value: 'green_community', label: 'Green Community', area: 'South' },
  { value: 'palm_jumeirah', label: 'Palm Jumeirah', area: 'Coastal' },
  { value: 'mirdif', label: 'Mirdif', area: 'East' },
  { value: 'barsha', label: 'Al Barsha', area: 'Central' },
  { value: 'tecom', label: 'TECOM (Media/Internet City)', area: 'Central' },
];

export default function DubaiCommunitySelect({ value, onChange, placeholder = "Select community" }) {
  const groupedCommunities = DUBAI_COMMUNITIES.reduce((acc, community) => {
    if (!acc[community.area]) acc[community.area] = [];
    acc[community.area].push(community);
    return acc;
  }, {});

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedCommunities).map(([area, communities]) => (
          <div key={area}>
            <div className="px-2 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50">
              {area}
            </div>
            {communities.map((community) => (
              <SelectItem key={community.value} value={community.value}>
                {community.label}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}