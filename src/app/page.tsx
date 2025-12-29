import { VideoChatProvider } from '@/contexts/VideoChatContext';
import { VideoChat } from '@/components';

export default function Home() {
  return (
    <VideoChatProvider>
      <VideoChat />
    </VideoChatProvider>
  );
}
