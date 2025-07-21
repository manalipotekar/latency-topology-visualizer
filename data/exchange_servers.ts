export const dataCenters = [
  {
    id: "aws-tokyo",
    provider: "AWS",
    location: "Tokyo",
    coordinates: [139.6917, 35.6895],
    latency: {
      aws: 12,
      gcp: 20,
      azure: 18
    },
    radius: 80000
  },
  {
    id: "gcp-frankfurt",
    provider: "GCP",
    location: "Frankfurt",
    coordinates: [8.6821, 50.1109],
    latency: {
      aws: 22,
      gcp: 10,
      azure: 15
    },
    radius: 60000
  },
  {
    id: "azure-virginia",
    provider: "Azure",
    location: "Virginia",
    coordinates: [-77.0369, 38.9072],
    latency: {
      aws: 30,
      gcp: 25,
      azure: 8
    },
    radius: 50000
  }
];
