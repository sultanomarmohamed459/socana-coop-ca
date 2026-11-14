import heroImg from '../assets/images/hero_hevea_plantation_1794662318708.jpg';
import tappingImg from '../assets/images/latex_harvest_tapping_1794662319023.jpg';
import producersImg from '../assets/images/ivorian_producers_collab_1794662319253.jpg';
import collectionImg from '../assets/images/latex_collection_operations_1794662319564.jpg';
import sustainableImg from '../assets/images/sustainable_agroforestry_1794662320007.jpg';
import canopyImg from '../assets/images/about_cooperative_canopy_1794662320234.jpg';
import type { MediaKey } from '../types';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/SOCANA_a32a32db.png';

export const MEDIA_ASSETS: Record<
  MediaKey,
  { src: string; alt: string; caption: string }
> = {
  hero: {
    src: heroImg,
    alt: "Plantation d'hévéas en Côte d'Ivoire baignée dans la lumière matinale",
    caption: "Plantation structurée d'Hevea brasiliensis en Côte d'Ivoire",
  },
  tapping: {
    src: tappingImg,
    alt: "Récolte du latex naturel s'écoulant dans le godet sur un tronc d'hévéa",
    caption: 'Saignée maîtrisée et récolte du latex naturel',
  },
  producers: {
    src: producersImg,
    alt: "Producteurs ivoiriens collaborant au cœur d'une plantation d'hévéas",
    caption: 'Accompagnement de proximité et partage technique entre producteurs',
  },
  collection: {
    src: collectionImg,
    alt: "Opérations de pesée et de collecte du caoutchouc naturel dans un centre coopératif",
    caption: 'Collecte groupée et pesée transparente du caoutchouc naturel',
  },
  sustainable: {
    src: sustainableImg,
    alt: "Parcelle d'agroforesterie hévéicole durable sous une brume tropicale",
    caption: 'Gestion durable des sols et préservation du couvert végétal',
  },
  canopy: {
    src: canopyImg,
    alt: "Allée ombragée au milieu d'une hévéaculture mature en Côte d'Ivoire",
    caption: 'Pérennité des plantations et transmission du savoir-faire',
  },
};

export function resolveArticleImage(mediaKey: MediaKey, customImageUrl?: string): {
  src: string;
  alt: string;
} {
  if (customImageUrl && customImageUrl.trim().length > 0) {
    return {
      src: customImageUrl.trim(),
      alt: MEDIA_ASSETS[mediaKey]?.alt ?? 'Illustration agricole SOCANA COOP CA',
    };
  }
  const asset = MEDIA_ASSETS[mediaKey] ?? MEDIA_ASSETS.canopy;
  return { src: asset.src, alt: asset.alt };
}
