const mongoose = require('mongoose');

/**
 * Builds an aggregation pipeline for ranking open Opportunities by matching with student's skills
 *
 * @param {Array<mongoose.Types.ObjectId|string>} studentSkillIds - List of Skill ObjectIds that the student has
 * @param {number} limit - Maximum number of recommended opportunities to return (default: 10)
 * @param {object} additionalMatch - Additional filters (e.g., type, audience, location)
 * @returns {Array<object>} MongoDB aggregation pipeline stages
 */
const buildRecommendationPipeline = (studentSkillIds = [], limit = 10, additionalMatch = {}) => {
  const convertedSkillIds = (studentSkillIds || []).map((id) =>
    typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
  );

  return [
    {
      $match: {
        status: 'open',
        ...additionalMatch,
      },
    },
    {
      $addFields: {
        totalRequiredCount: {
          $size: { $ifNull: ['$requiredSkills', []] },
        },
        matchedSkillsList: {
          $setIntersection: [
            {
              $map: {
                input: { $ifNull: ['$requiredSkills', []] },
                as: 'req',
                in: '$$req.skillId',
              },
            },
            convertedSkillIds,
          ],
        },
      },
    },
    {
      $addFields: {
        matchedSkillsCount: {
          $size: { $ifNull: ['$matchedSkillsList', []] },
        },
        matchPercentage: {
          $cond: [
            { $gt: ['$totalRequiredCount', 0] },
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        { $size: { $ifNull: ['$matchedSkillsList', []] } },
                        '$totalRequiredCount',
                      ],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
            50, // default match score if no specific skills are required
          ],
        },
      },
    },
    {
      $lookup: {
        from: 'industries',
        localField: 'postedByIndustryId',
        foreignField: '_id',
        as: 'industry',
      },
    },
    {
      $unwind: {
        path: '$industry',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        matchPercentage: -1,
        deadline: 1,
        createdAt: -1,
      },
    },
    ...(limit > 0 ? [{ $limit: limit }] : []),
  ];
};

/**
 * Calculates in-memory match percentage between student skills and opportunity required skills (fallback/utility)
 * @param {Array} studentSkills - Array of student skill objects { skillId, skillName, proficiencyScore }
 * @param {Array} requiredSkills - Array of required skills { skillId, skillName }
 * @returns {number} matchPercentage (0 to 100)
 */
const calculateMatchPercentageJS = (studentSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) return 50;

  const studentSkillMap = new Map();
  studentSkills.forEach((s) => {
    const id = s.skillId ? s.skillId.toString() : '';
    const name = s.skillName ? s.skillName.toLowerCase().trim() : '';
    if (id) studentSkillMap.set(id, s.proficiencyScore || 70);
    if (name) studentSkillMap.set(name, s.proficiencyScore || 70);
  });

  let matchedScoreSum = 0;
  let matchesCount = 0;

  requiredSkills.forEach((req) => {
    const reqId = req.skillId ? req.skillId.toString() : '';
    const reqName = req.skillName ? req.skillName.toLowerCase().trim() : '';

    if (reqId && studentSkillMap.has(reqId)) {
      matchedScoreSum += studentSkillMap.get(reqId);
      matchesCount++;
    } else if (reqName && studentSkillMap.has(reqName)) {
      matchedScoreSum += studentSkillMap.get(reqName);
      matchesCount++;
    }
  });

  if (matchesCount === 0) return 30; // base score

  const coverageRatio = matchesCount / requiredSkills.length;
  const avgProficiency = matchedScoreSum / matchesCount;

  // Blended score: 60% coverage + 40% proficiency
  return Math.round(coverageRatio * 60 + (avgProficiency / 100) * 40);
};

module.exports = {
  buildRecommendationPipeline,
  calculateMatchPercentageJS,
};
