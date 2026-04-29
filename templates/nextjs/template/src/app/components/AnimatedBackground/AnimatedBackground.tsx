import {
  IconKey16,
  IconBug16,
  IconCpu16,
  IconSwords16,
  IconRadarO32,
  IconCapsule16,
  IconUserMask16,
  IconCrosshairs16,
  IconShieldCheck16,
  IconChartNetwork16,
} from '@koobiq/react-icons';

import s from './AnimatedBackground.module.css';

export const AnimatedBackground = () => {
  return (
    <div className={s.base}>
      <IconSwords16 className={s.svg} width={128} height={128} />
      <IconCpu16 className={s.svg} width={128} height={128} />
      <IconCapsule16 className={s.svg} width={128} height={128} />
      <IconCrosshairs16 className={s.svg} width={128} height={128} />
      <IconShieldCheck16 className={s.svg} width={128} height={128} />
      <IconUserMask16 className={s.svg} width={128} height={128} />
      <IconRadarO32 className={s.svg} width={128} height={128} />
      <IconKey16 className={s.svg} width={128} height={128} />
      <IconChartNetwork16 className={s.svg} width={128} height={128} />
      <IconBug16 className={s.svg} width={128} height={128} />
    </div>
  );
};
