import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  StoryWrapper,
  StoryTitle,
  StoryMeta,
  StoryMetaElement,
} from '../styles/StoryStyles';
import { getStory } from '../services/hnApi';
import mapTime from '../utils/mapTime';

const Story = ({ storyId }) => {
  const [story, setStory] = useState({});

  useEffect(() => {
    getStory(storyId).then((data) => data && data.url && setStory(data));
  }, []);

  return story && story.url ? (
    <StoryWrapper>
      <StoryTitle>
        <a href={story.url} target="_blank" rel="noreferrer">
          {story.title}
        </a>
      </StoryTitle>

      <StoryMeta>
        <span className="story__by" data-testid="story-by">
          <StoryMetaElement>By: </StoryMetaElement>
          {story.by}
        </span>

        <span className="story__time" data-testid="story-time">
          <StoryMetaElement>Posted: </StoryMetaElement>
          {mapTime(story.time)} ago
        </span>
      </StoryMeta>
    </StoryWrapper>
  ) : null;
};

Story.propTypes = {
  storyId: PropTypes.number.isRequired,
};

export default Story;
