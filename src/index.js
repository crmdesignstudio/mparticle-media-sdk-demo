import mParticle from '@mparticle/web-sdk';
import MediaSession from '@mparticle/web-media-sdk';

// Function to log events to UI
function logEvent(eventName, details = '') {
    const eventsLog = document.getElementById('eventsLog');
    const event = document.createElement('div');
    event.className = 'event';
    event.textContent = `${new Date().toLocaleTimeString()} - ${eventName}${details ? ': ' + details : ''}`;
    eventsLog.insertBefore(event, eventsLog.firstChild);
}

// Initialize media tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const mainVideo = document.getElementById('myVideo');
    const adVideo = document.getElementById('adVideo');
    const adContainer = document.getElementById('adContainer');
    const adNotice = document.querySelector('.ad-notice');
    const endSessionBtn = document.getElementById('endSessionBtn');
    let mediaSession;
    let isSessionActive = false;
    let isAdPlaying = false;

    // Initialize mParticle with proper configuration
    const options = {
        isDevelopmentMode: true,
        logLevel: 'verbose',
        identifyRequest: {
            userIdentities: {
                customerid: 'test-customer-id'
            }
        },
        identityCallback: function(result) {
            console.log('Identity callback result:', result);
        }
    };

    // Function to play pre-roll ad
    function playPreRollAd() {
        return new Promise((resolve) => {
            adContainer.style.display = 'block';
            adNotice.style.display = 'block';
            isAdPlaying = true;
            
            // Log ad break start
            mediaSession.logAdBreakStart({
                title: 'Pre-roll',
                duration: 30,
                position: 0
            });

            // Create ad object with required properties
            const adObject = {
                title: 'Pre-roll Ad 1',
                id: 'ad-123',
                advertiser: 'Sample Advertiser',
                campaign: 'Sample Campaign',
                duration: 30,
                creative: 'Creative 1',
                siteid: 'Site 1',
                placement: 'Pre-roll',
                position: 0
            };

            // Log individual ad start
            mediaSession.logAdStart(adObject);

            adVideo.play().catch(error => {
                console.error('Error playing ad:', error);
            });

            // Ad event listeners
            adVideo.addEventListener('ended', function onAdEnded() {
                mediaSession.logAdEnd();
                mediaSession.logAdBreakEnd();
                adContainer.style.display = 'none';
                adNotice.style.display = 'none';
                adVideo.removeEventListener('ended', onAdEnded);
                isAdPlaying = false;

                // Show play button overlay
                const contentOverlay = document.getElementById('contentOverlay');
                const playButton = document.getElementById('playButton');
                contentOverlay.style.display = 'flex';
                
                playButton.addEventListener('click', function onPlayButtonClick() {
                    mainVideo.muted = false; // Unmute when user clicks
                    mainVideo.play().then(() => {
                        contentOverlay.style.display = 'none';
                        playButton.removeEventListener('click', onPlayButtonClick);
                    }).catch(error => {
                        console.error('Error playing main content:', error);
                        logEvent('Error', 'Failed to play main content: ' + error.message);
                    });
                });

                resolve();
            });

            // Track ad progress
            let lastAdPosition = 0;
            adVideo.addEventListener('timeupdate', function onAdTimeUpdate() {
                const currentTime = adVideo.currentTime;
                
                // Update ad progress
                mediaSession.logPlayheadPosition(currentTime);

                // Log quartile events
                const duration = adVideo.duration;
                const percentage = (currentTime / duration) * 100;

                if (lastAdPosition < 25 && percentage >= 25) {
                    // First Quartile
                    mParticle.logEvent(
                        'Ad Quartile Reached',
                        mParticle.EventType.Other,
                        {
                            quartile: 1,
                            percentage: 25,
                            adTitle: 'Pre-roll Ad 1'
                        }
                    );
                    logEvent('Ad First Quartile');
                } else if (lastAdPosition < 50 && percentage >= 50) {
                    // Midpoint
                    mParticle.logEvent(
                        'Ad Quartile Reached',
                        mParticle.EventType.Other,
                        {
                            quartile: 2,
                            percentage: 50,
                            adTitle: 'Pre-roll Ad 1'
                        }
                    );
                    logEvent('Ad Midpoint');
                } else if (lastAdPosition < 75 && percentage >= 75) {
                    // Third Quartile
                    mParticle.logEvent(
                        'Ad Quartile Reached',
                        mParticle.EventType.Other,
                        {
                            quartile: 3,
                            percentage: 75,
                            adTitle: 'Pre-roll Ad 1'
                        }
                    );
                    logEvent('Ad Third Quartile');
                }

                lastAdPosition = percentage;
            });

            // Additional ad event listeners
            adVideo.addEventListener('pause', function() {
                if (isAdPlaying) {
                    mediaSession.logPause();
                    logEvent('Ad Paused');
                }
            });

            adVideo.addEventListener('play', function() {
                if (isAdPlaying) {
                    mediaSession.logPlay();
                    logEvent('Ad Resumed');
                }
            });

            adVideo.addEventListener('waiting', function() {
                if (isAdPlaying) {
                    mediaSession.logBufferStart();
                    logEvent('Ad Buffering');
                }
            });

            adVideo.addEventListener('playing', function() {
                if (isAdPlaying && adVideo.readyState === 4) {
                    mediaSession.logBufferEnd();
                    logEvent('Ad Buffer End');
                }
            });
        });
    }

    // Function to end media session
    function endMediaSession() {
        if (mediaSession && isSessionActive) {
            try {
                // Pause the video if it's playing
                if (!mainVideo.paused) {
                    mainVideo.pause();
                }
                
                // Log content end and session end
                mediaSession.logMediaContentEnd();
                mediaSession.logMediaSessionEnd();
                
                logEvent('Media Session Ended', 'User manually ended session');
                isSessionActive = false;
                
                // Disable the end session button
                endSessionBtn.disabled = true;
                endSessionBtn.style.opacity = '0.5';
                endSessionBtn.style.cursor = 'not-allowed';
            } catch (error) {
                console.error('Error ending media session:', error);
                logEvent('Error', 'Failed to end media session: ' + error.message);
            }
        }
    }

    // Function to initialize media tracking
    function initializeMediaTracking() {
        try {
            console.log('Initializing media tracking...');
            
            // Initialize media session with content details
            const mediaContentTitle = 'Big Buck Bunny';
            const mediaContentId = 'BBB-123';
            const mediaContentDuration = mainVideo.duration || 0;
            const streamType = 'VOD';
            const contentType = 'Video';

            // Create a new media session
            mediaSession = new MediaSession(
                mParticle,
                mediaContentTitle,
                mediaContentId,
                mediaContentDuration,
                streamType,
                contentType,
                {
                    custom_attribute: 'value',
                    player_name: 'HTML5 Video Player',
                    player_version: '1.0.0'
                }
            );

            // Start the media session
            mediaSession.logMediaSessionStart();
            isSessionActive = true;
            
            // Enable the end session button
            endSessionBtn.disabled = false;
            endSessionBtn.style.opacity = '1';
            endSessionBtn.style.cursor = 'pointer';
            
            logEvent('Media SDK initialized');
            logEvent('Media Session Started', mediaContentTitle);

            // Play pre-roll ad before starting content
            playPreRollAd();

            // Set up event listeners after successful initialization
            setupEventListeners();
        } catch (error) {
            console.error('Error initializing media tracking:', error);
            logEvent('Error', error.message);
        }
    }

    // Function to set up event listeners
    function setupEventListeners() {
        // Add end session button click handler
        endSessionBtn.addEventListener('click', endMediaSession);

        // Event Listeners for video player
        mainVideo.addEventListener('play', function() {
            if (isSessionActive && !isAdPlaying) {
                mediaSession.logPlay();
                logEvent('Play');
            }
        });

        mainVideo.addEventListener('pause', function() {
            if (isSessionActive && !isAdPlaying) {
                mediaSession.logPause();
                logEvent('Pause');
            }
        });

        mainVideo.addEventListener('ended', function() {
            if (isSessionActive) {
                mediaSession.logMediaContentEnd();
                mediaSession.logMediaSessionEnd();
                isSessionActive = false;
                endSessionBtn.disabled = true;
                endSessionBtn.style.opacity = '0.5';
                endSessionBtn.style.cursor = 'not-allowed';
                logEvent('Content & Session Ended');
            }
        });

        mainVideo.addEventListener('seeking', function() {
            if (!isAdPlaying) {
                mediaSession.logSeekStart(mainVideo.currentTime);
                logEvent('Seek Start', `Position: ${mainVideo.currentTime.toFixed(2)}s`);
            }
        });

        mainVideo.addEventListener('seeked', function() {
            if (!isAdPlaying) {
                mediaSession.logSeekEnd(mainVideo.currentTime);
                logEvent('Seek End', `Position: ${mainVideo.currentTime.toFixed(2)}s`);
            }
        });

        // Update playhead position periodically
        setInterval(() => {
            if (!mainVideo.paused && !isAdPlaying) {
                mediaSession.logPlayheadPosition(mainVideo.currentTime);
                logEvent('Playhead Update', `Position: ${mainVideo.currentTime.toFixed(2)}s`);
            }
        }, 1000);

        // Buffer events
        mainVideo.addEventListener('waiting', function() {
            if (!isAdPlaying) {
                mediaSession.logBufferStart();
                logEvent('Buffer Start');
            }
        });

        mainVideo.addEventListener('playing', function() {
            if (mainVideo.readyState === 4 && !isAdPlaying) {
                mediaSession.logBufferEnd();
                logEvent('Buffer End');
            }
        });

        // Quality of Service
        mainVideo.addEventListener('loadedmetadata', function() {
            if (!isAdPlaying) {
                mediaSession.logQoS(
                    mainVideo.videoWidth,
                    mainVideo.videoHeight,
                    mainVideo.getVideoPlaybackQuality().droppedVideoFrames,
                    mainVideo.getVideoPlaybackQuality().totalVideoFrames,
                    mainVideo.playbackRate,
                    mainVideo.duration,
                    'auto'
                );
                logEvent('QoS Update', `Resolution: ${mainVideo.videoWidth}x${mainVideo.videoHeight}`);
            }
        });
    }

    // Initialize mParticle and wait for everything to be ready
    mParticle.init(process.env.MPARTICLE_WEB_API_KEY, options);

    // Use mParticle.ready() to ensure SDK is fully loaded
    mParticle.ready(function() {
        console.log('mParticle SDK is ready');
        // Wait for video metadata
        if (mainVideo.readyState >= 1) {
            initializeMediaTracking();
        } else {
            mainVideo.addEventListener('loadedmetadata', initializeMediaTracking);
        }
    });
}); 