import * as React from 'react';

function FollowIcon(props: React.SVGProps<SVGSVGElement> & { followed?: boolean }) {
  const { followed, ...svgProps } = props;

  return (
    <svg fill="none" height="16" viewBox="0 0 12 16" width="12" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      {followed ? (
        <path
          d="M1.33869e-07 2V15.5C-6.33938e-05 15.5868 0.0224845 15.6722 0.0654246 15.7476C0.108365 15.8231 0.170217 15.8861 0.244892 15.9304C0.319567 15.9747 0.404491 15.9988 0.491305 16.0003C0.578119 16.0018 0.66383 15.9807 0.74 15.939L6 13.069L11.26 15.939C11.3362 15.9807 11.4219 16.0018 11.5087 16.0003C11.5955 15.9988 11.6804 15.9747 11.7551 15.9304C11.8298 15.8861 11.8916 15.8231 11.9346 15.7476C11.9775 15.6722 12.0001 15.5868 12 15.5V2C12 1.46957 11.7893 0.960859 11.4142 0.585786C11.0391 0.210714 10.5304 0 10 0L2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 1.33869e-07 1.46957 1.33869e-07 2Z"
          fill="#82AAD2"
        />
      ) : (
        <path
          d="M0 2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0L10 0C10.5304 0 11.0391 0.210714 11.4142 0.585786C11.7893 0.960859 12 1.46957 12 2V15.5C12 15.5904 11.9754 15.6792 11.9289 15.7568C11.8824 15.8343 11.8157 15.8979 11.736 15.9405C11.6563 15.9832 11.5664 16.0035 11.4761 15.9992C11.3858 15.9948 11.2983 15.9661 11.223 15.916L6 13.101L0.777 15.916C0.701705 15.9661 0.61423 15.9948 0.523891 15.9992C0.433553 16.0035 0.343733 15.9832 0.263999 15.9405C0.184266 15.8979 0.117604 15.8343 0.0711141 15.7568C0.024624 15.6792 4.67204e-05 15.5904 0 15.5V2ZM2 1C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2V14.566L5.723 12.084C5.80506 12.0294 5.90143 12.0003 6 12.0003C6.09857 12.0003 6.19494 12.0294 6.277 12.084L11 14.566V2C11 1.73478 10.8946 1.48043 10.7071 1.29289C10.5196 1.10536 10.2652 1 10 1H2Z"
          fill="#82AAD2"
        />
      )}
    </svg>
  );
}

export default FollowIcon;
