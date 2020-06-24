import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  StoryWrapper,
  StoryTitle,
  StoryMeta,
  StoryMetaElement,
} from '../styles/StoryStyles';
import mapTime from '../utils/mapTime';

const Story = memo(function Story({ title, url, by, time }) {
  return url ? (
    <StoryWrapper>
      <StoryTitle>
        <a href={url} target="_blank" rel="noreferrer">
          {title}
        </a>
      </StoryTitle>

      <StoryMeta>
        <span className="story__by" data-testid="story-by">
          <StoryMetaElement>By: </StoryMetaElement>
          {by}
        </span>

        <span className="story__time" data-testid="story-time">
          <StoryMetaElement>Posted: </StoryMetaElement>
          {mapTime(time)} ago
        </span>
      </StoryMeta>
    </StoryWrapper>
  ) : null;
});

Story.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  by: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default Story;
